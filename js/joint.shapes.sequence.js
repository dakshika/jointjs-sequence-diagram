/**
 * Define base object for sequences
 * @type {{}}
 */
joint.shapes.sequence = {};

/**
 * Add basic wrapper for sequence elements remove handler
 * @type {void|*}
 */
joint.shapes.sequence.sequenceElement = joint.shapes.basic.Generic.extend({

    toolMarkup: ['<g class="sequence-controllers">',
        '<g class="sequence-controller-remove"><circle fill="red" r="11"/>',
        '<path transform="scale(.8) translate(-16, -16)" d="M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z"/>',
        '<title>Remove this element from the model</title>',
        '</g>',
        '</g>'].join(''),

    defaults: joint.util.deepSupplement({
        attrs: {},
    }, joint.shapes.basic.Generic.prototype.defaults)

});

/**
 * Add Link customization for jointjs link
 * @type {void|*}
 */
joint.shapes.sequence.Link = joint.dia.Link.extend({

    defaults: joint.util.deepSupplement({

        type: 'sequence.Link',
        attrs: {
            '.connection': {stroke: '#96281B'},
            '.marker-target': {fill: '#96281B', stroke: '#D2527F', d: 'M 10 0 L 0 5 L 10 10 z'}
        }

    }, joint.dia.Link.prototype.defaults)
});


/**
 * Add frame block
 * @type {void|*}
 */
joint.shapes.sequence.frame = joint.shapes.sequence.sequenceElement.extend({
    markup: '<g class="rotatable"><g class="scalable"><rect class="frame"/></g><text/></g>',

    defaults: joint.util.deepSupplement({
        type: 'sequence.Frame',
        size: {width: 120, height: 100},
        attrs: {
            rect: {width: 100, height: 40, fill: 'rgba(255, 255, 255, 0)', stroke: 'grey'},
        },
    }, joint.shapes.sequence.sequenceElement.prototype.defaults)
});


/**
 * Add Participant block
 * @type {void|*}
 */
joint.shapes.sequence.Participant = joint.shapes.sequence.sequenceElement.extend({
    markup: '<g class="rotatable"><g class="scalable"><line class="wire"/></g><rect class="group"/><text/></g>',

    defaults: joint.util.deepSupplement({
        type: 'sequence.Participant',
        position: {x: 50, y: 50},
        size: {width: 5, height: 180},
        attrs: {
            text: {text: 'Participant ', fill: 'black', 'ref-dx': -40, 'ref-y': 10},
            rect: {width: 100, height: 40, x: -50},
            '.group': {fill: '#fff', stroke: '#96281B', 'stroke-width': 1, magnet: 'passive'},
            '.wire': {x1: "0", y1: "2", stroke: '#96281B', 'stroke-dasharray': '8,5', magnet: true, 'stroke-width': 2}
        }
    }, joint.shapes.sequence.sequenceElement.prototype.defaults)

});

/**
 * Override default element view
 * @type {void|*}
 */
joint.shapes.sequence.sequenceElementView = joint.dia.ElementView.extend({

    initialize: function () {
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