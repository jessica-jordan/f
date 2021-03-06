import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('network');
  this.route('index-loading');
  this.route('register');
  this.route('login');
  this.route('mutations');
  this.route('dashboard');
});

export default Router;
