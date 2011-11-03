/*
 * jQuery Mobile Framework : "subpage" plugin
 * Copyright(c) Achilles Software.
 * Authored by Todd J. Thomson, achilles@telus.net
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Based on the jQuery Mobile "listview" plugin.
 * Copyright (c) jQuery Project
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 */

(function ($, undefined) {
 
 // Description:
 //
 //  A jQuery Mobile widget that allows subpages to be added to pages.
 //
 // Usage
 //
 //  Add child divs with data-role="subpage" to a parent div with data-role="page".
 //
 // Notes
 //
 //  Subpages are detached from parent page and added/removed to/from the DOM.
 //  The functionality provided by this widget is a workaround for the jQuery Mobile
 //  loadPage() function which only loads the first page in an AJAX response. 
 //     
 
 // Keeps track of the number of subpages per parent page UID
 var subpageCountPerPage = {};
 
 $.widget("mobile.subpage", $.mobile.widget, {
          options: {
          initSelector: ":jqmData(role='subpage')"
          },
          
          _create: function () {
          var t = this;
          this.parentPage = this.element.closest(".ui-page");
          
          // create subpage markup
          t.element.addClass(function (i, orig) {
                             return orig + " ui-subpage ";
                             });
          
          t._createSubPage();
          },
          
          _createSubPage: function () {
          var self = this;
          var subpage = this.element;
          var subpageId = subpage.attr("id");
          var parentPage = subpage.closest(".ui-page");
          var parentUrl = parentPage.jqmData("url");
          var parentId = parentUrl || parentPage[0][$.expando];
          
          if (typeof subpageCountPerPage[parentId] === "undefined") {
          subpageCountPerPage[parentId] = -1;
          }
          
          var subpageUId = subpageId || ++subpageCountPerPage[parentId];
          var subpageId = subpage.attr("id") || subpageUId;
          var subpageUrl = (parentUrl || "") + "&" + $.mobile.subPageUrlKey + "=" + subpageUId;
          
          var newPage = subpage.detach();
          
          newPage
          .attr("data-" + $.mobile.ns + "url", subpageUrl)
          .attr("data-" + $.mobile.ns + "role", 'page')
          .appendTo($.mobile.pageContainer);
          
          newPage.page();
          
          // on pagehide, remove any nested pages along with the parent page, as long as they aren't active
          // and aren't embedded
          if (parentPage.is(":jqmData(external-page='true')") &&
              parentPage.data("page").options.domCache === false) {
          
          var newRemove = function (e, ui) {
          var nextPage = ui.nextPage, npURL;
          
          if (ui.nextPage) {
          npURL = nextPage.jqmData("url");
          if (npURL.indexOf(parentUrl + "&" + $.mobile.subPageUrlKey) !== 0) {
          self.childPages().remove();
          parentPage.remove();
          }
          }
          };
          
          // unbind the original page remove and replace with our specialized version
          parentPage
          .unbind("pagehide.remove")
          .bind("pagehide.remove", newRemove);
          }
          },
          
          // TODO sort out a better way to track sub pages of the parent page
          childPages: function () {
          var parentUrl = this.parentPage.jqmData("url");
          
          return $(":jqmData(url^='" + parentUrl + "&" + $.mobile.subPageUrlKey + "')");
          }
          });
 
 // Auto self-init widgets
 $(document).bind("pagecreate create", function (e) {
                  $($.mobile.subpage.prototype.options.initSelector, e.target).subpage();
                  });
 
 })(jQuery);
