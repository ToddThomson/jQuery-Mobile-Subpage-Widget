/*
* jQuery Mobile Framework SubPage Widget, version 1.1
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
*    jQuery Mobile version 1.1
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

    // Keeps track of the number of subpages per parent page UID
    var subpageCountPerPage = {};

    $.widget("mobile.subpage", $.mobile.widget, {
        options: {
            initSelector: ":jqmData(role='subpage'), :jqmData(role='subpage-dialog')"
        },

        _create: function () {
            var t = this;

            this.parentPage = this.element.closest(":jqmData(role='page')");
            
            // Create subpage markup
            t.element.addClass(function (i, orig) {
                return orig + " ui-subpage ";
            });

            t._createSubPage();
        },

        _createSubPage: function () {
            var self = this;
            var subpage = this.element;
            var subpageId = subpage.attr("id");
            var parentPage = subpage.closest(":jqmData(role='page')");

            var parentUrl = parentPage.jqmData("url") + "#" + parentPage.attr('id');
            var parentId = parentUrl || parentPage[0][$.expando];

            if (typeof subpageCountPerPage[parentId] === "undefined") {
                subpageCountPerPage[parentId] = -1;
            }

            var subpageUId = subpageId || ++subpageCountPerPage[parentId];
            var subpageId = subpage.attr("id") || subpageUId;
            var subpageType = subpage.jqmData("role");
            var subpageContent = subpage.find(":jqmData(role='content')");
            var subpageUrl = (parentUrl || "") + "&" + $.mobile.subPageUrlKey + "=" + subpageUId;

            var newPage = subpage.detach();

            newPage
                .attr("data-" + $.mobile.ns + "url", subpageUrl)
                .attr("data-" + $.mobile.ns + "role", 'page');

            // work-around for dialogs not getting default content theme of "c"
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
    // TJT: With jQM 1.1.x we bind to pagebeforecreate before any widgets start to enhance the page.
    //      See Issue: #4496
    $(document).bind("pagebeforecreate", function (e) {
        $($.mobile.subpage.prototype.options.initSelector, e.target).subpage();
    });

})(jQuery);
