define("myAccountService",["utilities"],function(a){"use strict";var b={init:function(){this.editButton=document.getElementById("editbutton"),this.saveButton=document.getElementById("savebutton"),this.editButton.addEventListener("click",this.toggleEditFields.bind(this,"edit")),this.saveButton.addEventListener("click",this.saveFields.bind(this,"save"))},toggleButtons:function(a){this.editButton.style.display="edit"===a?"none":"block",this.saveButton.style.display="edit"===a?"block":"none"},toggleEditFields:function(a,b){b.preventDefault(),this.toggleButtons.call(this,a),Array.prototype.forEach.call(document.querySelectorAll("input"),function(b,c){"username"!==b.name&&"accountLevel"!==b.name&&(b.disabled="edit"!==a)})},saveFields:function(c,d){d.preventDefault();var e=this,f={};Array.prototype.forEach.call(document.querySelectorAll("input"),function(a){f[a.name]=a.value});a.ajax(f,"post","/edit/account",function(c){b.toggleEditFields.call(e,"save",d),a.showModal(c)})}};return b});