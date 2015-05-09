define("groupsService",["utilities","groupModel"],function(a,b){"use strict";var c={init:function(){this.userName=document.getElementById("hgov-user-information").innerHTML,this.reactTable=a.reactClasses.getGroupTable("groupTable",this),this.setEvents()},setEvents:function(){this.form=document.querySelector("form[name='add-group-form']"),this.form.addEventListener("keydown",a.resetState.bind(this,"#groupName-help-block")),document.getElementById("create-group").addEventListener("click",this.createGroupModal.bind(this)),document.getElementById("submit-create-group").addEventListener("click",this.createGroup.bind(this)),document.getElementById("import-num").addEventListener("click",this.showImportModal)},createGroupModal:function(){document.querySelector("input[name='creator']").value=this.userName,a.modalPrompt("createGroup","show")},createGroup:function(){if(this.validate.create()){var b={};Array.prototype.forEach.call(this.form.querySelectorAll("form[name='add-group-form'] input"),function(a){b[a.name]=a.value}),a.ajax(b,"post","/create/group",function(b){a.modalPrompt("createGroup","hide"),a.showModal(b)})}else document.getElementById("groupName-help-block").style.display="block"},viewGroupModal:function(c,d){var e,f=document.querySelector('form[name="group-details-form"]'),g=b.create(c);this.resetInputs(f.querySelectorAll("input")),g.values.forEach(function(b){!b.iterable&&b.visible&&(e=f.querySelector('input[name="'+b.id+'"]'),e.value=b.value),!b.iterable&&b.editable&&d&&(e.disabled=!1),b.iterable&&b.value.forEach(function(c){document.querySelector('form[name="'+b.id+'"]').appendChild(a.getFormGroup(b.label,c.value,!b.editable,d))})}),this.getSaveButton(g,d),this.getModifyButtons(g,d),a.modalPrompt("groupDetails","show")},resetInputs:function(a){document.querySelector('form[name="assoc-numbers"]').innerHTML="",document.querySelector('form[name="assoc-users"]').innerHTML="",Array.prototype.forEach.call(a,function(a){a.disabled=!0})},getSaveButton:function(a,b){if(document.getElementById("save-button").innerHTML="",b){var c=document.createElement("button");c.className="btn btn-success",c.innerHTML="Save",c.addEventListener("click",a.save.bind(this,this.reactTable)),c.setAttribute("data-dismiss","modal"),document.getElementById("save-button").appendChild(c)}},getModifyButtons:function(a,b){if(document.getElementById("add-numbers").innerHTML="",document.getElementById("add-users").innerHTML="",b){var c=document.createElement("button"),d=document.createElement("button");c.className="btn",d.className="btn",c.innerHTML="Add Numbers",d.innerHTML="Add Users",document.getElementById("add-numbers").appendChild(c),document.getElementById("add-users").appendChild(d),d.addEventListener("click",this.addInputToGroup.bind(this,"assoc-users","User Name")),c.addEventListener("click",this.addInputToGroup.bind(this,"assoc-numbers","Phone Number"))}},addInputToGroup:function(b,c){var d=document.querySelector('form[name="'+b+'"]');d.appendChild(a.getFormGroup(c,"",!1,!0))},editGroupModal:function(a){this.viewGroupModal(a,!0)},removeGroupModal:function(b){var c={result:"Are you sure you'd like to delete this group for all users?"},d=document.querySelector(".hgov-modal-text-delete");d.style.display="",d.removeEventListener("click",a.ajax,!1),d.addEventListener("click",a.ajax.bind(this,{id:b._id},"post","/delete/group",function(a){window.location.reload()})),a.showModal(c)},showImportModal:function(){a.modalPrompt("importNum","show");var b=document.getElementById("importGroups");-1===b.options.selectedIndex&&(a.ajax({username:a.getCurrentUserName()},"post","/find/availableGroups",function(a){a.groups.forEach(function(a){var c=document.createElement("option");c.value=a._id,c.text=a.groupName,b.appendChild(c)})}),document.getElementById("submit-import").addEventListener("click",a.uploadFile.bind(this,"fileUpload",b)))},validate:{create:function(){var a=document.querySelector("input[name='groupName']").value;return a.length>=6}}};return c});