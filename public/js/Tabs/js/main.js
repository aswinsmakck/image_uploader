var WestDragonTab = (function(){


var containerClickHandler = function (evt) {
    var currentElement = evt.target;
    var tabHeader = currentElement.classList.contains("tab-header") ? currentElement : currentElement.parentElement.classList.contains("tab-header") ? currentElement.parentElement : null;
    if(tabHeader != null)
    {
        var tabHeaderContainer = tabHeader.parentElement
        var tabContainer = tabHeaderContainer.parentElement
        var tabContentContainer = tabContainer.querySelector(".tab-content-container")

        //retrieving tab Index
        var nodes = Array.prototype.slice.call(tabHeaderContainer.children)
        var tabIndex = nodes.indexOf(tabHeader)

        //removing active class for current header element
        tabHeaderContainer.querySelector(".active").classList.remove("active")
        
        //setting clicked element as active
        tabHeader.classList.add("active");

        //removing active class for current content element
        tabContentContainer.querySelector(".active").classList.remove("active")

        //setting clicked index content as active
        tabContentContainer.children[tabIndex].classList.add("active")
    }
}
function init(){
    window.addEventListener("DOMContentLoaded",function(){
        var container = document.querySelectorAll(".tab-container")
        console.log(container)
        container.forEach(function(tabContainer){
            console.log(tabContainer)
            tabContainer.addEventListener("click",containerClickHandler);
        });
    });

}

return {init:init}

})();


WestDragonTab.init();
