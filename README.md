Version

    vNext

Description

    A jQuery Mobile widget that allows subpages to be added to pages. This is useful
    when a mobile view needs to be structured as a number of partial views with page
    transitions between them. This gives a HTML5 mobile app more of a native feel.
    For views of this type the added benefit is that only 1 AJAX request is needed.

    The functionality provided by this widget is a workaround for the jQuery Mobile
    loadPage() function which only loads the first page in an AJAX response. You do
    not use this widget on your initial document load.

Usage

    Add a stack of child div's with data-role="subpage" or data-role="subpage-dialog"
    to a parent div with data-role="page".

Notes

    Subpage div's are automatically detached from the parent page div and inserted
    into the DOM when the parent page is loaded. When the parent page is hidden, the
    child subpage div's are removed from the DOM.

    The functionality provided by this widget is a workaround for the jQuery Mobile
    loadPage() function which only loads the first page in an AJAX response.

Demo

    Please visit the http://m.integra-international.net website  to launch the new
    Integra Mobile web app which utilizes the subpage widget. After the web app
    launches, press the info button on RHS of the header bar. Next select the
    "Integra Mobile" list item. The 'Integra Mobile' page contains a subpage which
    is accessible through the 'About' list item.
    
Sample

A Visual Studio MVC4 sample app is provided. 


Change Log

1.3.1, 1.2.0 - 9 Sept 2013

- Fixed issue #26.

1.3 - 5 March 2013

- Fixed incompatibility with jQueryMobile 1.3.0's change from storing data in .data('page') to .data('mobile-page').
  The plugin now adapts based on the jQueryMobile version in use.
