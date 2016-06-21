joint.shapes.sequence = {};

joint.shapes.sequence.participant = joint.dia.Element.extend({
    markup: '<g class="rotatable"><g class="scalable"><rect class="group"/></g><path class="wire"/><text/></g>',

    defaults: joint.util.deepSupplement({
        type: 'sequence.participant',
        position:{ x: 0},
        size: { width: 100, height: 30 },
        attrs: {
            '.group': { fill: 'red', stroke: 'black', 'stroke-width': 2,  width: 100, height: 20 },
            '.wire': { 'ref-dy':-45, 'x-alignment': 'middle', d: 'm52,53l0,254l0,-254z', stroke: 'black' , 'stroke-dasharray':'5,5'}
        }
    }, joint.dia.Element.prototype.defaults)

});
