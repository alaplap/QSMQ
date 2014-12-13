/*
   Quick Social Media Query for Instagram profiles
   Copyright (C) 2014  Mester Ádám
   email: m.dm@gmx.us

   This program is free software: you can redistribute it and/or modify
   it under the terms of the GNU General Public License as published by
   the Free Software Foundation, either version 3 of the License, or
   (at your option) any later version.

   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.

   You should have received a copy of the GNU General Public License
   along with this program.  If not, see < http://www.gnu.org/licenses/ >.
*/

var clientID, activeUserTag;

/* YOUR CLIEND ID GOES HERE:*/
qsmq_setID("...");



$( document ).ready(function() {
   $('.qsmq-ins-user').each(function() {
      $(this).mouseover(popUpProfile);
   });
});

function popUpProfile() {

   var position = $(this).position();
   var height = $(this).height();
   var userName = $(this).text();
   var userID;
   
   if($('.qsmq.' + userName).length) return;
   
   /* popup */
   var popup = document.createElement('div');
   $(popup).addClass('qsmq popup loading ' + userName)
      .css( 'left', position.left )
      .css( 'top', position.top );
         
      /* popup header */
      var header = document.createElement('div');
      $(header).addClass('qsmq-header');
      
         var profPicDiv = document.createElement('div');
         $(profPicDiv).addClass('prof-pic');
            
            var profPic = new Image();
            
            var profLdr = document.createElement('div');
            $(profLdr).addClass('prof-ldr');
            
         $(profPicDiv).append(profPic)
            .append(profLdr);
         
         var profName = document.createElement('a');
         $(profName).addClass('prof-name');
         
      $(header).append(profPicDiv)
         .append(profName);
   
   $(popup).append(header);
   
      /* popup body */
      var body = document.createElement('div');
      $(body).addClass('qsmq-body');
      
         var webLink = document.createElement('a');
         $(webLink).addClass('prof-web');
            
      $(body).append(webLink);
      
   $(popup).append(body);
   
      /* popup footer */
      var footer = document.createElement('div');
      $(footer).addClass('qsmq-footer');
      
         var profBio = document.createElement('div');
         var profPost = document.createElement('span');
         var profFlwr = document.createElement('span');
         var profFlwi = document.createElement('span');
   
      $(footer).append(profBio)
         .append(profPost)
         .append(profFlwr)
         .append(profFlwi);
   
   $(popup).append(footer);
   
   
   $('body').append( popup );
   
   /* popup positioning */
   $(popup).css('top', position.top + height / 2);
   /* popup event */
   $(popup).on("click", function () {
      $(this).remove();
   });

   $.ajax({
      url: "auth.php?username=" + userName + "&clientid=" + clientID + "&count=1", 
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      type: "GET",
      success: function (result) {
         result = jQuery.parseJSON(result);
         
         // popup hatter
         // utolso kep: result.data[0].images.low_resolution.url
         $(popup).css('background-image', 'url('+result.data[0].images.low_resolution.url+')');
         
         // profilkep: result.data[0].user.profile_picture
         profPic.src = result.data[0].user.profile_picture;
         
         // felhasznali ID-je
         userID = result.data[0].user.id;
         
         // felhasznaloi info lekerese
         $.ajax({
            url: "userinfo.php?userid=" + userID + "&clientid=" + clientID, 
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            type: "GET",
            success: function (userInfoJSON) {
               userInfoJSON = jQuery.parseJSON(userInfoJSON);
            
               // profil nev: userInfoJSON.data.full_name
               $(profName).append(userInfoJSON.data.full_name);
               $(profName).attr('href', 'http://instagram.com/' + userName )
                  .attr('target', '_blank');
                  
               // weboldal link: userInfoJSON.data.website
               var webLinkUrl = userInfoJSON.data.website;
               
               if (webLinkUrl.length !== 0) {
                  $(webLink).attr('href', webLinkUrl)
                     .attr('target', '_blank');
                  
                  var shortLink = userInfoJSON.data.website;
                  shortLink = shortLink.replace('http://','').replace('https://','');
                  $(webLink).append(shortLink);
               } else {
                  $(body).css('display', 'none');
               }
                     
               // profil bio: userInfoJSON.data.bio
               var biography = userInfoJSON.data.bio;
               if (biography.length > 150)
                  biography = biography.substring(0,150) + "...";
                  
               $(profBio).append(biography);
               
               var posts = shortNumber(userInfoJSON.data.counts.media);
               var flwrs = shortNumber(userInfoJSON.data.counts.follows);
               var flwis = shortNumber(userInfoJSON.data.counts.followed_by);               
               
               $(profPost).append(posts);
               $(profFlwr).append(flwrs);
               $(profFlwi).append(flwis);
               
               $(popup).removeClass().addClass('qsmq popup loaded ' + userName);
               
               /* popup event */
               $(popup).on("mouseleave", function () {
                  $(this).remove();
               });
            }
         });
         
      },
      error: function () {
         $(profLdr).css('background-color', 'red');
      }
   });
}

function qsmq_setID(ID) {
   clientID = ID;
}

function shortNumber(n) {
   if (n > 999999)
      return Math.floor(n/1000000) + "M +";
   else if (n > 99999)
      return Math.floor(n/1000) + "K +";
   else
      return n + "";
}