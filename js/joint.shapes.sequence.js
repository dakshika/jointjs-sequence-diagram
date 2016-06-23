joint.shapes.sequence = {};

joint.shapes.sequence.sequenceElement = joint.shapes.basic.Generic.extend({

    toolMarkup: ['<g class="sequence-controllers">',
        '<g class="sequence-controller-remove"><circle fill="red" r="11"/>',
        '<path transform="scale(.8) translate(-16, -16)" d="M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z"/>',
        '<title>Remove this element from the model</title>',
        '</g>',
        '</g>'].join(''),

    defaults: joint.util.deepSupplement({
        attrs: {

        },
    }, joint.shapes.basic.Generic.prototype.defaults)

});

joint.shapes.sequence.Participant = joint.shapes.sequence.sequenceElement.extend({
    markup: '<g class="rotatable"><g class="scalable"><rect class="group"/></g><path class="wire"/><text/></g>',

    defaults: joint.util.deepSupplement({
        type: 'sequence.Participant',
        position:{ x: 50, y:50},
        size: { width: 100, height: 30 },
        attrs: {
            '.group': { fill: '#EFEFEF', stroke: 'black', 'stroke-width': 1,  width: 100, height: 20, magnet:'passive' },
            '.wire': { 'ref-dy':-50, 'x-alignment': 'middle', d: 'm52,53l0,254l0,-254z', stroke: 'black' , 'stroke-dasharray':'5,5', magnet:true, 'stroke-width': 2,}
        }
    }, joint.shapes.sequence.sequenceElement.prototype.defaults)

});

joint.shapes.sequence.sequenceElementView = joint.dia.ElementView.extend({

    initialize: function() {
        joint.dia.ElementView.prototype.initialize.apply(this, arguments);
    },

    render: function () {
        joint.dia.ElementView.prototype.render.apply(this, arguments);
        this.renderTools();
        this.update();
        return this;
    },

    renderTools: function () {
        var toolMarkup = this.model.toolMarkup || this.model.get('toolMarkup');
        if (toolMarkup) {
            var nodes = V(toolMarkup);
            V(this.el).append(nodes);
        }
        return this;
    },

    pointerclick: function (evt, x, y) {

        this._dx = x;
        this._dy = y;
        this._action = '';

        var className = evt.target.parentNode.getAttribute('class');
        switch (className) {

            case 'sequence-controller-remove':
                this.model.remove();
                return;
                break;
            default:
        }

        joint.dia.CellView.prototype.pointerclick.apply(this, arguments);
    }

});

joint.shapes.sequence.ParticipantView = joint.shapes.sequence.sequenceElementView;