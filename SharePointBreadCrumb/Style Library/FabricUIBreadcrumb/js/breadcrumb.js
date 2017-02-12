document.addEventListener("DOMContentLoaded", function () {
    //Get script location to inject the css file
    var scripts = document.getElementsByTagName("script");
    var pathBreadCrumb = "";

    //gets the location of the breadcrumb script to inject the css
    if (scripts && scripts.length > 0) {
        for (var i in scripts) {
            if (scripts[i].src && scripts[i].src.match(/breadcrumb\.js$/)) {
                pathBreadCrumb = scripts[i].src.replace(/(.*)breadcrumb\.js$/, "$1");
                pathBreadCrumb = pathBreadCrumb.replace("/js/", "/");
                break;
            }
        }
    };

    function injectCSS() {
        try {
            if (pathBreadCrumb) {
                var style = document.createElement("link");
                style.href = pathBreadCrumb + 'css/breadcrumb.css';
                style.type = "text/css";
                style.rel = "stylesheet";
                document.getElementsByTagName("head")[0].appendChild(style);
            }
        }
        catch (ex) {

        }
    }

    injectCSS();


    SP.SOD.executeFunc('SP.js', 'SP.ClientContext', LoadSiteBreadcrumb);


    function LoadSiteBreadcrumb() {
        var breadCrumbNode;
        var clientcontext = SP.ClientContext.get_current();
        var site = clientcontext.get_site();
        var currentWeb = clientcontext.get_web();
        clientcontext.load(currentWeb, 'ServerRelativeUrl', 'Title', 'ParentWeb', 'Url');
        clientcontext.load(site, 'ServerRelativeUrl');
        clientcontext.executeQueryAsync(
		function () {
		    var breadcrumbWrapper = document.createElement('div');
		    breadcrumbWrapper.className = "ms-Breadcrumb";
		    breadcrumbWrapper.innerHTML = '<div class="ms-FocusZone"><ul id="breadcrumbSite" class="ms-Breadcrumb-list"></ul></div>';

		    //for Seattle Master
		    if (document.getElementById('contentRow') !== null) {
		        document.getElementById('DeltaPlaceHolderMain').insertBefore(breadcrumbWrapper, document.getElementById('mainContent'));
		    } else {
                //for Oslo Master
		        document.getElementById('contentBox').insertBefore(breadcrumbWrapper, document.getElementById('DeltaPlaceHolderMain'));
		    }

		    var breadCrumbNode = document.getElementById('breadcrumbSite');
		    var Custombreadcrumb = document.getElementById('DeltaPlaceHolderMain');
		    var breadCrumbNode = document.getElementById('breadcrumbSite');
		    if (document.location.pathname.indexOf('SitePages') != -1 || document.location.pathname.indexOf('Pages') != -1) {
		        var li = document.createElement('li');
		        li.className = "ms-Breadcrumb-listItem";
		        if (document.title.split('-').length > 1) {
		            li.innerHTML = '<span class="ms-Breadcrumb-itemLink">' + document.title.split('-')[1].trim() + '</span><i class="ms-Breadcrumb-chevron ms-Icon ms-Icon--ChevronRight"></i>'
		        } else {
		            li.innerHTML = '<span class="ms-Breadcrumb-itemLink">' + document.title.trim() + '</span><i class="ms-Breadcrumb-chevron ms-Icon ms-Icon--ChevronRight"></i>'
		        }
		        breadCrumbNode.insertBefore(li, breadCrumbNode.childNodes[0]);
		    }
		    else if (document.location.pathname.indexOf('_layouts/15/') != -1) {
		        var li = document.createElement('li');
		        li.className = "ms-Breadcrumb-listItem";
		        li.innerHTML = '<span class="ms-Breadcrumb-itemLink">' + document.title + '</span><i class="ms-Breadcrumb-chevron ms-Icon ms-Icon--ChevronRight"></i>'
		        breadCrumbNode.insertBefore(li, breadCrumbNode.childNodes[0]);
		    }

		    var li = document.createElement('li');
		    li.className = "ms-Breadcrumb-listItem";
		    li.innerHTML = '<a class="ms-Breadcrumb-itemLink" href="' + currentWeb.get_url() + '">' + currentWeb.get_title() + '</a><i class="ms-Breadcrumb-chevron ms-Icon ms-Icon--ChevronRight"></i>'
		    if (Custombreadcrumb != null) {
		        breadCrumbNode.insertBefore(li, breadCrumbNode.childNodes[0]);
		    }
		    if (site.get_serverRelativeUrl() !== currentWeb.get_serverRelativeUrl()) {
		        RecursiveWeb(currentWeb.get_parentWeb().get_serverRelativeUrl())
		    }
		}, fail);
    }


    function RecursiveWeb(siteUrl) {
        var Custombreadcrumb = document.getElementById('contentBox');
        var breadCrumbNode = document.getElementById('breadcrumbSite');
        var clientcontext = new SP.ClientContext(siteUrl);
        var site = clientcontext.get_site();
        var currentWeb = clientcontext.get_web();
        clientcontext.load(currentWeb, 'ServerRelativeUrl', 'Title', 'ParentWeb', 'Url');
        clientcontext.load(site, 'ServerRelativeUrl');
        clientcontext.executeQueryAsync(function () {
            if (site.get_serverRelativeUrl() !== currentWeb.get_serverRelativeUrl()) {
                var li = document.createElement('li');
                li.className = "ms-Breadcrumb-listItem";
                li.innerHTML = '<a class="ms-Breadcrumb-itemLink" href="' + currentWeb.get_url() + '">' + currentWeb.get_title() + '</a><i class="ms-Breadcrumb-chevron ms-Icon ms-Icon--ChevronRight"></i>'
                var Custombreadcrumb = document.getElementById('contentBox');
                breadCrumbNode.insertBefore(li, breadCrumbNode.childNodes[0]);
                RecursiveWeb(currentWeb.get_parentWeb().get_serverRelativeUrl())
            } else {
                var li = document.createElement('li');
                li.className = "ms-Breadcrumb-listItem";
                li.innerHTML = '<a class="ms-Breadcrumb-itemLink" href="' + currentWeb.get_url() + '">' + currentWeb.get_title() + '</a><i class="ms-Breadcrumb-chevron ms-Icon ms-Icon--ChevronRight"></i>'
                breadCrumbNode.insertBefore(li, breadCrumbNode.childNodes[0]);
            }
        }, fail);
    }

    function fail() {
        console.log('Unable to load SharePoint BreadCrumb');
    }



    //Feature Images
    findImagesByRegexp();
    function findImagesByRegexp() {
        var images = Array.prototype.slice.call((document.getElementById('DeltaPlaceHolderMain') || document).getElementsByTagName('img'));
        var length = images.length;
        for (var i = 0; i < length; ++i) {
            if (images[i].src.indexOf('breadcrumb.png') != -1) {
                images[i].src = pathBreadCrumb + '/images/breadcrumb.png';
            }
        }
    }
});
