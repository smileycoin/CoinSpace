'use strict';

var Ractive = require('lib/ractive')
var emitter = require('lib/emitter')
var initHeader = require('widgets/header')
var initTabs = require('widgets/tabs')
var initSidebar = require('widgets/sidebar')
var initTerms = require('widgets/terms')
var initSend = require('pages/send')
var initReceive = require('pages/receive')
var initExchange = require('pages/exchange')
var initHistory = require('pages/history')
var initGetSMLY = require('pages/getsmly')
var initTokens = require('pages/tokens')
var initVote = require('pages/vote')
var initCoupons = require('pages/coupons')
var Hammer = require('hammerjs')

module.exports = function(el){
  var ractive = new Ractive({
    el: el,
    template: require('./index.ract')
  })

  // widgets
  var header = initHeader(ractive.find('#header'))
  initTabs(ractive.find('#tabs'))
  initSidebar(ractive.find('#sidebar'))
  initTerms(ractive.find('#terms'))

  // tabs
  var tabs = {
    send: initSend(ractive.find('#send')),
    receive: initReceive(ractive.find('#receive')),
    exchange: initExchange(ractive.find('#exchange')),
    history: initHistory(ractive.find('#history')),
	get_smly: initGetSMLY(ractive.find('#get_smly')),
    tokens: initTokens(ractive.find('#tokens')),
    vote: initVote(ractive.find('#vote')),
    coupons: initCoupons(ractive.find('#coupons'))
  }

  var currentPage = tabs.send
  showPage(tabs.send)

  if (process.env.BUILD_TYPE === 'phonegap') {
    Hammer(ractive.find('#main'), {velocity: 0.1}).on('swipeleft', function() {
      if (currentPage === tabs.send) {
        emitter.emit('change-tab', 'receive')
      } else if (currentPage === tabs.receive) {
        emitter.emit('change-tab', 'exchange')
      } else if (currentPage === tabs.exchange) {
        emitter.emit('change-tab', 'history')
      } else if (currentPage === tabs.history) {
        emitter.emit('change-tab', 'get_smly')
	  } else if (currentPage === tabs.get_smly) {
		emitter.emit('change-tab', 'vote')
	  } else if (currentPage === tabs.vote) {
		emitter.emit('change-tab', 'coupons')
	  } else if (currentPage === tabs.coupons) {
		emitter.emit('change-tab', 'tokens')
      }
    })

    Hammer(ractive.find('#main'), {velocity: 0.1}).on('swiperight', function() {
      if (currentPage === tabs.tokens) {
        emitter.emit('change-tab', 'coupons')
      } else if (currentPage === tabs.coupons) {
        emitter.emit('change-tab', 'vote')
	  } else if (currentPage === tabs.vote) {
        emitter.emit('change-tab', 'getsmly')
	  } else if (currentPage === tabs.getsmly) {
        emitter.emit('change-tab', 'history')
      } else if (currentPage === tabs.history) {
        emitter.emit('change-tab', 'exchange')
      } else if (currentPage === tabs.exchange) {
        emitter.emit('change-tab', 'receive')
      } else if (currentPage === tabs.receive) {
        emitter.emit('change-tab', 'send')
      }
    })
  }

  emitter.on('change-tab', function(tab) {
    showPage(tabs[tab])
  })

  emitter.on('toggle-terms', function(open) {
    var classes = ractive.find('#main').classList
    if (open) {
      classes.add('terms-open')
      classes.add('closed')
    } else {
      classes.remove('terms-open')
      classes.remove('closed')
    }
  })

  function showPage(page){
    currentPage.hide()
    page.show()
    currentPage = page
  }

  // menu toggle
  emitter.on('toggle-menu', function(open) {
    var classes = ractive.find('#main').classList
    if(open) {
      ractive.set('sidebar_open', true)
      classes.add('closed')
    } else {
      ractive.set('sidebar_open', false)
      classes.remove('closed')
    }

    header.toggleIcon(open)
  })

  return ractive
}
