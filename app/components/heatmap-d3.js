import Ember from 'ember';
import heatmap from '../utils/heatmap-module';

export default Ember.Component.extend({
  classNames: ['heatmap-d3','facade-element'],
  cnt: 0,
  svgRatio: null,
  fillBaseColor: '#64B5F6',
  heatMap: Ember.computed('jsonData.@each', function(){
    return this.$('#heatmapInstance');
  }),
  init(){
    this._super(...arguments);

  },
  selectedSnps: [],
  uniqueSelectedSnps: Ember.computed.uniq('selectedSnps'),
  selectedSnpsList: Ember.computed('uniqueSelectedSnps', function(){
    return this.get('uniqueSelectedSnps').toArray();
  }),
  anySnpSelected: Ember.computed.notEmpty('uniqueSelectedSnps'),
  currentHasMut: Ember.computed.bool('currentMut'),
  mutatedClass: Ember.computed('currentHasMut', function(){
    if (this.get('currentHasMut') === true){
      return "mutated";
    }
  }),
  currentMut: null,
  currentPatient: null,
  currentSnp: null,
  currentMuts: Ember.computed('currentSnp', function(){
    let currentMuts = this.get('jsonData').filterBy('y', this.get('currentSnp'));
    return currentMuts;
  }),
  currentMutsAffected: Ember.computed('currentSnp', function(){
    return this.get('currentMuts').filterBy('value', 1);
  }),
  numOfCurrentMutsAffected: Ember.computed('currentSnp', function(){
    return this.get('currentMutsAffected').get('length');
  }),
  numOfCurrentMuts: Ember.computed('currentSnp', function(){
    return this.get('currentMuts').get('length');
  }),
  percOfCurrentMutsAffected: Ember.computed('currentSnp', function(){
    return Math.floor(this.get('numOfCurrentMutsAffected') / this.get('numOfCurrentMuts') * 100);
  }),
  noSnpSelected: Ember.computed.none('currentSnp'),
  elementInfo: function(d, i, elObj){
    //let data =  this.get('elementInfo');
    let patient = d.x;
    let snp = d.y;
    let mut = d.value;
    if (elObj.selected == null){
      this.set('currentMut', mut);
      this.set('currentSnp', snp);
      this.set('currentPatient', patient);
      this.sendAction('metaDataAction', this.get('currentSnp'));
      return true;
    }
  },

  removeElementInfo: function(d, i, elObj){
   this.set('currentMut', null);
   this.set('currentSnp', null);
   this.set('currentPatient', null);
  },
  renderHeatMap: function(){

    let data = this.get('jsonData');

    let sortedData = JSON.parse(JSON.stringify(this.get('jsonData').sortBy('x')));
    heatmap.update([]);
    let svgRatio = heatmap.update(sortedData, this.get('elementInfo').bind(this), this.get('removeElementInfo').bind(this), this.get('fillBaseColor'));
    this.set('svgRatio', svgRatio);

  }.observes('jsonData'),
  didInsertElement(){
    if (this.get('jsonData') !== undefined && this.get('jsonData') !== null){
      this.$('.collapsible').collapsible();
      let parsedData = JSON.parse(JSON.stringify(this.get('jsonData').toArray()));
      let newHeatMap = heatmap.heatmapModule({
          target: '#heatWrapper', 
          data: parsedData, 
          clickHandler: this.get('elementInfo').bind(this), 
          counterClickHandler: this.get('removeElementInfo').bind(this),
          fillBaseColor: this.get('fillBaseColor')
      });
      this.get('noSnpSelected');
    }
  },
  actions: {
    addSnpToSelection(rsId){
      this.get('selectedSnps').pushObject(rsId);
    }
  }
});
