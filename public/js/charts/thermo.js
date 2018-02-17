/* the configuration example:
    var th_config = {
        totalCount: total, totalCountLabel: "total", usedCount : 0, usedCountLabel:"used", usedPercentageLabel: "",
        levels: [
            {threshold: 0, colour: "#d9d9d9"}, // base level
            {threshold: 20, colour: "#ffddee"},
            {threshold: 40, colour: "#ffddcc"},
            {threshold: 60, colour: "#94d095"}
        ],
        value: [
            { label: "Positive", val: 19},
            { label: "Negative", val: 80},
            { label: "Neutral", val: 39},
            { label: "Mixed", val: 55}
        ],
    };
 *  to draw: thermo_draw( id, th_config );
 */

const noop = () => {};
class D3Component
{
    constructor({tagName, className})
    {
        this.state = {
            tagName: tagName || "div", 
            className,
            key: undefined
        };

        let InstanceMetadata = () => {};
        const selected = (node) => { return (node.nodeName ? d3.select(node) : node); }

        InstanceMetadata.createInstance = (node, d, owner) => {
            node.__instance__ = {
            owner,
            destroy: () => owner.exit(selected(node), d),
            };
        }

        InstanceMetadata.applyInstance =  (node, cb) => {
            const instance = node.__instance__;
            if(cb && instance) {
                return cb(instance);
            } else {
                return instance;
            }
        }

        InstanceMetadata.getOwner = (node) => {
            return InstanceMetadata.applyInstance(node, (instance) => { 
                return instance.owner; 
            });
        }

        InstanceMetadata.destroyInstance = (owner) => {
            // first, destroy all descendants
            selected(owner).selectAll('*').each((d, i, arr) => {
                const node = arr[i];
                InstanceMetadata.applyInstance(node, (instance) => { 
                instance.destroy(node); 
                });
            });
            // now destroy the instance
            InstanceMetadata.applyInstance(owner, (instance) => {     
                (instance.destroy(owner) || selected(owner)).remove(); 
            });
        }
        D3Component.select = selected;  
        D3Component.InstanceMetadata = InstanceMetadata;  
    }
    

    mountIn(node, data, context)
    {
        const {InstanceMetadata, select} = D3Component;
        const isOwnedByMe = (node) => {
            const owner = InstanceMetadata.getOwner(node);
            if(owner) { return (owner === this || owner.name === "component"); }
        };

        const children = select(node)
                            .selectAll((d, i, nodes) => {
                                const node = nodes[i];
                                return Array.from(node.children).filter(isOwnedByMe);
                            })
                            .data(data);

        this.renderChildren(children);
        return children;
    }

    renderChildren( children )
    {
        const {tagName, className} = this.state;
        const {InstanceMetadata} = D3Component;

        // on element creation
        var mounted = children.enter()
            .append(tagName).attr('class', className);

        mounted.each((d, i, nodes) => {
            const node = nodes[i];
            InstanceMetadata.createInstance(node, d, this);
            this.enter(node, d);
            this.merge(node, d);
        });

        // on data change
        children.each((d, i, nodes) => {
            const node = nodes[i];
            this.merge(node, d);
        });

        // on exit
        children.exit()
            .each((d, i, nodes) => {
            const node = nodes[i];
            InstanceMetadata.destroyInstance(node);
            });

        return children;
    }
    enter(_) { /* overwrite in inheriting components */ }
    merge(_) { /* overwrite in inheriting components */  }
    exit(_) {  /* overwrite in inheriting components */ }
}

// This component displays the visualization.
const {select} = d3;

class Thermometer extends D3Component
{
    constructor(props)
    {
        super(props);
        const config = { 
            rectH: 100, 
            rectW: 50, 
            strk: 0, 
            outerRectBg: "#f3f3f3", 
            tickColor: "#8c8c8c", 
            tickQty: 20
        };
        this.state = Object.assign(this.state, config);
    }
    enter(node, d)
    {
        const { rectH, rectW, strk, outerRectBg, tickColor, tickQty } = this.state;

        select(node)
            .attr("width", rectW+strk)
            .attr("height", rectH+strk);

        var outerRect = select(node).append("rect")
            .attr("x", 0).attr("y", 0)
            .attr("height", rectH).attr("width", rectW)
            .style("fill",   outerRectBg)
            .style("stroke", outerRectBg)
            .style("stroke-width", "" + strk + "px");

        var innerRect = select(node).append("rect").attr("class", "innerRect")

        var scale = d3.range(0, tickQty);

        var tickWidth = 0;
        var wideTickWidth = 10;

        var lines = select(node).selectAll("line.xScale");
        var lineEnter = lines.data(scale).enter();
        lineEnter.append("line").attr("class", "xScale")
            .attr("x1", strk/2)
            .attr("y1", function(d) { return (rectH/tickQty * d);})
            .attr("x2", function(d) { return (strk/2) + ((d % 2 === 0) ? wideTickWidth : tickWidth);})
            .attr("y2", function(d) { return (rectH/tickQty * d);})
            .style("stroke", tickColor).style("stroke-width", "1px");
    }
    merge(node, d)
    {
        const {percent, label, color} = d;
        const { rectH, rectW, strk, outerRectBg, tickColor } = this.state;
        select(node).selectAll("rect.innerRect").attr("x", strk/2).attr("y", rectH - percent)
            .attr("height", percent).attr("width", rectW - strk)
            .style("fill", color);
    }
}

class Bullet  extends D3Component
{
    enter(node, d)
    {
        select(node).append('div')
            .attr('class', 'bullet')
            .html(`
            <div><span class="dot" style="background-color: ${d.color}"></span><span class="label">${d.label}</span></div>
            <div><span class="count">${d.count}</span></div>
            `);
    }
}

class ThermoWidget extends D3Component
{
    getThermometerData(d)
    {
        const {totalCount, usedCount, usedPercentageLabel, levels} = d;
        const percent = d.usedPercentage = (usedCount >= totalCount) ? 100 : (usedCount/totalCount) * 100;
        const level = levels.filter((d) => { return percent >= d.threshold; }).slice(-1);
        const color = d.usedColor = level[0].colour;
        return {percent, color, label: usedPercentageLabel};
    }

    enter(node, d)
    {
        this.refs = {
            thermo : new Thermometer({tagName:'svg', className: 'thermometer'}),
            bullet1 : new Bullet({tagName:'div', className: 'bullet'}),
            bullet2 : new Bullet({tagName:'div', className: 'bullet'})
        };
    }
    merge(node, d)
    {
        const {thermo, bullet1, bullet2} = this.refs;
        var leftPanel =  select(node).append('div').attr('class', 'panel left');
        thermo.mountIn(leftPanel, [this.getThermometerData(d)]);
        leftPanel.append('div').attr('class', 'percent-summary')
            .html(`<div class="count">${parseFloat(d.usedPercentage).toFixed( 1 )}%</div><div class="label">${d.usedPercentageLabel}</div>`);
        // var rightPanel = select(node).append('div').attr('class', 'panel right');
        // bullet1.mountIn(rightPanel, [{color: "#f3f3f3", count: d.totalCount, label: d.totalCountLabel}]);
        // bullet2.mountIn(rightPanel, [{color: d.usedColor, count: d.usedCount, label:d.usedCountLabel}]);
    }
}

const thermo_draw = function( id, config )
{
    // set the label and value
    var d = config.value.map((d) => {
        return Object.assign({}, config, {usedCount: d.val, usedPercentageLabel: d.label});
    });

    const div = document.createElement('div');
    document.getElementById( id ).appendChild(div);

    const wgt  = new ThermoWidget({tagName:'div', className: 'thermo-widget'});
    wgt.mountIn(d3.select(div), d);
};