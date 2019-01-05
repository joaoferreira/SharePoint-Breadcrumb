var breadcrumbProperties = {
    showFolders: true,
    breadcrumbElement: "",
    pagesLibrary: "Pages",
    sitePagesLibrary: "Site Pages",
    hidePageLibraries: true,
    hideFromPages: [""]
};

document.addEventListener("DOMContentLoaded", function () {

    for (var i = 0; i < breadcrumbProperties.hideFromPages.length; i++) {
        if (document.location.href == breadcrumbProperties.hideFromPages[i]) {
            return;
        }
    }


//Get script location to inject the css file
    var scripts = document.getElementsByTagName("script");
    var pathBreadCrumb = "";
    if (scripts && scripts.length > 0) {
        for (var i in scripts) {
            if (scripts[i].src && scripts[i].src.match(/\/js\/breadcrumb\.js/)) {
				pathBreadCrumb = scripts[i].src.replace(/(.*)\/js\/breadcrumb\.js.*/,"$1/");
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

    function getListTitle() {
        var listTile = _spPageContextInfo.listTitle;
        var listUrl = _spPageContextInfo.listUrl;

        //not supported on SharePoint on prem
        if (listTile == undefined) {
            return;
        }

        if (!breadcrumbProperties.hidePageLibraries) {
            if ((listTile == breadcrumbProperties.sitePagesLibrary) || (listTile == breadcrumbProperties.pagesLibrary)) {
                $('#breadcrumbSite li:last').before('<li class="ms-Breadcrumb-listItem"><a class="ms-Breadcrumb-itemLink" href="' + listUrl + '">' + listTile + '</a><i class="ms-Breadcrumb-chevron ms-Icon ms-Icon--ChevronRight"></i></li>');
            }
        }
    }

    function getFolders() {
        if ($('#DeltaPlaceHolderPageTitleInTitleArea span span').length > 0 && (document.location.href).indexOf('RootFolder=') != -1) {
            //get nodes from url
            var siteServerRelativeUrl = _spPageContextInfo.siteServerRelativeUrl;
            if (siteServerRelativeUrl == "/") {
                siteServerRelativeUrl = "";
            }

            var libraryLocation = unescape(document.location).split("RootFolder=")[1].split("&Folder")[0].replace(siteServerRelativeUrl, '');

            var libraryNodes = libraryLocation.split('/');
            var libraryNodeURL = _spPageContextInfo.serverRequestPath + "?RootFolder=" + siteServerRelativeUrl;
            $.each(libraryNodes, function (index, value) {

                if (value != "") {
                    libraryNodeURL = libraryNodeURL + "/" + value;
                    $('#breadcrumbSite').append('<li class="ms-Breadcrumb-listItem"><a class="ms-Breadcrumb-itemLink" href="' + libraryNodeURL + '">' + value + '</a><i class="ms-Breadcrumb-chevron ms-Icon ms-Icon--ChevronRight"></i></li>');

                }
                

            });
        }
    }


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
		    if (breadcrumbProperties.breadcrumbElement == "") {
		        if (document.getElementById('contentRow') !== null) {
		            try {
		                //old Seattle master
		                document.getElementById('DeltaPlaceHolderMain').insertBefore(breadcrumbWrapper, document.getElementById('mainContent'));
		            } catch (err) {
		                document.getElementById('contentBox').insertBefore(breadcrumbWrapper, document.getElementById('DeltaPlaceHolderMain'));
		            }
		        } else {
		            document.getElementById('contentBox').insertBefore(breadcrumbWrapper, document.getElementById('DeltaPlaceHolderMain'));
		        }
		    } else {
		        $(breadcrumbProperties.breadcrumbElement).append(breadcrumbWrapper);
		    }


		    var breadCrumbNode = document.getElementById('breadcrumbSite');
		    var Custombreadcrumb = document.getElementById('DeltaPlaceHolderMain');
		    var breadCrumbNode = document.getElementById('breadcrumbSite');
		    if (document.location.pathname.indexOf(breadcrumbProperties.sitePagesLibrary) != -1 || document.location.pathname.indexOf(breadcrumbProperties.pagesLibrary) != -1) {
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
		        getListTitle();//only supported on sharepoint online
		        if (breadcrumbProperties.showFolders) {
		            getFolders();
		        }
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
