/*
* jQuery Mobile Framework SubPage Widget, version 1.3.2
* Copyright(c) Achilles Software.
* Authored by Todd J. Thomson, achilles@telus.net
* Dual licensed under the MIT or GPL Version 2 licenses.
*
* Based on the jQuery Mobile "listview" plugin.
* Copyright (c) jQuery Project
* Dual licensed under the MIT or GPL Version 2 licenses.
* http://jquery.org/license
*/

/*
 * Tested with dependent libraries:
 *    jQuery Mobile version = 1.3
 */

/*
* Description
*
*   A jQuery Mobile widget that allows subpages to be added to pages.
*
* Usage
*
*   Add child divs with data-role="subpage" or data-role="subpage-dialog"
*   to a parent div with data-role="page".
*
* Notes
*
*   Subpages are detached from parent page and added/removed to/from the DOM.
*   The functionality provided by this widget is a workaround for the jQuery Mobile
*   loadPage() function which only loads the first page in an AJAX response.
*/

(function ($, undefined) {

    // Keeps track of the number of subpages per parent page UId
    var subpageCountPerPage = {};

    $.widget("mobile.subpage", $.mobile.widget, {
        options: {
            initSelector: ":jqmData(role='subpage'), :jqmData(role='subpage-dialog')"
        },

        _create: function () {
            var self = this;

            // Subpages may only be defined with pages dynamically loaded via loadPage().
            // Pages loaded this way always have a unique data-url attribute set.
            self.parentPage = self.element.closest(":jqmData(role='page')");
            self.parentPageUrl = self.parentPage.jqmData("url");

            self.element.addClass(function (i, orig) {
                return orig + " ui-subpage ";
            });

            self._createSubPage();
        },

        _createSubPage: function () {
            var self = this,
                subpage = self.element,
                subpageType = subpage.jqmData("role");

            // Subpages should have an id attribute, but we cannot guarentee this.
            // Fallback to the subpage count with the page as the UId
            if (typeof subpageCountPerPage[self.parentPageUrl] === "undefined") {
                subpageCountPerPage[self.parentPageUrl] = -1;
            }

            var subpageUId = subpage.attr("id") || ++subpageCountPerPage[self.parentPageUrl];
            var subpageUrl = self.parentPageUrl + "&" + $.mobile.subPageUrlKey + "=" + subpageUId;

            var newPage = subpage.detach();

            newPage
                .attr("data-" + $.mobile.ns + "url", subpageUrl)
                .attr("data-" + $.mobile.ns + "role", 'page');

            // Work-around for dialogs not getting default content theme of "c"
            var subpageContent = subpage.find(":jqmData(role='content')");

            if (subpageType === "subpage-dialog" && subpageContent.jqmData("theme") === undefined) {
                subpageContent.attr("data-" + $.mobile.ns + "theme", 'c');
            }

            newPage.appendTo($.mobile.pageContainer);

            if (subpageType === "subpage") {
                newPage.page();
            }
            else {
                newPage.dialog();
            }

            // On pagehide, remove any nested pages along with the parent page, as long as they aren't active
            // and aren't embedded
            if (self.parentPage.is(":jqmData(external-page='true')") &&
                 self.parentPage.data("mobile-page").options.domCache === false) {

                var subpageRemove = function (e, ui) {
                    var nextPage = ui.nextPage, npURL;

                    if (ui.nextPage) {
                        npURL = nextPage.jqmData("url");
                        if (npURL.indexOf(self.parentPageUrl + "&" + $.mobile.subPageUrlKey) !== 0) {
                            self.childPages().remove();
                            self.parentPage.remove();
                        }
                    }
                };

                // Unbind the original page remove and replace with our specialized version
                self.parentPage
                    .unbind("pagehide.remove")
                    .bind("pagehide.remove", subpageRemove);
            }
        },

        childPages: function () {
            return $(":jqmData(url^='" + this.parentPageUrl + "&" + $.mobile.subPageUrlKey + "')");
        }
    });

    // Auto self-init widgets

    // TJT: With jQM 1.2 we bind to pagecreate before any widgets start to enhance the page.
    //      See Subpage Widget Issue: #26

    $(document).bind("pagebeforecreate create", function (e) {
        $.mobile.subpage.prototype.enhanceWithin(e.target);
    });
})(jQuery);
