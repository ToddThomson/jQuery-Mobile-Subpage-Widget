/*
* jQuery Mobile Framework SubPage Widget, version 1.4.3
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
 *    jQuery Mobile version = 1.4.3
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

( function( $, undefined ) {

    // Keeps track of the number of subpages per parent page UId
    var subpageCountPerPage = {};

    $.widget( "mobile.subpage", {
        options: {
            initSelector: ":jqmData(role='subpage'), :jqmData(role='subpage-dialog')"
        },

        _create: function() {
            var self = this;

            // Subpages may only be defined with pages dynamically loaded via loadPage().
            // Pages loaded this way always have a unique data-url attribute set.
            self.parentPage = self.element.closest( ":jqmData(role='page')" );
            self.parentPageUrl = self.parentPage.jqmData( "url" );
            
            // Only allow parent page removal based on the subpage widget event handlers
            self.preventParentPageRemove = true;

            self.element.addClass( function( i, orig ) {
                return orig + " ui-subpage ";
            } );

            self._createSubPage();
        },

        _createSubPage: function() {
            var self = this,
                subpage = self.element,
                subpageType = subpage.jqmData( "role" );

            // Subpages should have an id attribute, but we cannot guarentee this.
            // Fallback to the subpage count with the page as the UId
            if ( typeof subpageCountPerPage[self.parentPageUrl] === "undefined" ) {
                subpageCountPerPage[self.parentPageUrl] = -1;
            }

            var subpageUId = subpage.attr( "id" ) || ++subpageCountPerPage[self.parentPageUrl];
            var subpageUrl = self.parentPageUrl + "&" + $.mobile.subPageUrlKey + "=" + subpageUId;

            var newPage = subpage.detach();

            newPage
                .attr( "data-" + $.mobile.ns + "url", subpageUrl )
                .attr( "data-" + $.mobile.ns + "role", 'page' );

            // Work-around for dialogs not getting default content theme of "c"
            var subpageContent = subpage.find( ":jqmData(role='content')" );

            if ( subpageType === "subpage-dialog" && subpageContent.jqmData( "theme" ) === undefined ) {
                subpageContent.attr( "data-" + $.mobile.ns + "theme", 'c' );
            }

            newPage.appendTo( $.mobile.pageContainer );

            if ( subpageType === "subpage" ) {
                newPage.page();
            } else {
                newPage.dialog();
            }

            self._addParentPageSubpage( newPage );

            // On subpage parent pagehide.remove event, remove any subpages along with the parent page when navigation is away
            // from the parent page to a page that is not a child of the parent page.
            if ( !self.parentPage.data( "mobile-page" ).options.domCache &&
                  self.parentPage.is( ":jqmData(external-page='true')" ) ) {

                var parentPageHideRemove = function( e, ui ) {
                    var nextPage = ui.nextPage, npURL;

                    if ( ui.nextPage ) {
                        npURL = nextPage.jqmData( "url" );
                        var parentUrlBase = self.parentPageUrl + "&" + $.mobile.subPageUrlKey;
                        var indx = npURL.indexOf( self.parentPageUrl + "&" + $.mobile.subPageUrlKey );

                        if ( indx < 0 ) {
                            self._removeParentPageSubpages();

                            // Allow the parent page to be removed
                            self.preventParentPageRemove = false;
                        } else {
                            // Don't allow the parent page to be removed
                            self.preventParentPageRemove = true;
                        }

                        return;
                    }
                };
                
                var parentPageRemove = function( e ) {
                    if ( self.preventParentPageRemove ) {
                        e.preventDefault();
                    }
                };

                // Unbind the original page remove and replace with our specialized version
                self.parentPage
                    .off( "pageremove" )
                    .on( "pageremove", parentPageRemove );

                self.parentPage
                    .unbind( "pagehide.remove" )
                    .bind( "pagehide.remove", parentPageHideRemove );
            }
        },

        _removeParentPageSubpages: function() {
            var $subpages = ( this.parentPage.jqmData( "subpages" ) || $() );
            
            $subpages.remove();
        },
    
        _addParentPageSubpage: function( newSubpage ) {
            var subpages = this.childPages();

            this.parentPage.jqmData( "subpages", $( subpages ).add( newSubpage ) );
        },

        // API
        childPages: function() {
            return this.parentPage.jqmData( "subpages" ) || $();
        }
    } );
} )( jQuery );