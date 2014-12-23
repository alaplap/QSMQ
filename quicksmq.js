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

/*
 * Globally visible variables
 */
var clientID, activeUserTag;

/*
 * Setting the client id. Check yours at http://instagram.com/developer/clients/manage/#
 */ 
function qsmq_setID(ID) {
   clientID = ID;
}

/* YOUR CLIEND ID GOES HERE: */
/* qsmq_setID(""); */

/*
 * Searching all user tags on the page and setting their mouseover event
 */
$(document).ready(function() {
   $('.qsmq-ins-user').each(function() {
      $(this).mouseover(popUpProfile);
   });
});

/*
 * Ajax API call, searching for the 5 most relevant user by name (`userName` parameter).
 */
function searchUser(userName) {
   return $.ajax({
     	url: "https://api.instagram.com/v1/users/search?q=" + userName + "&client_id=" + clientID + "&callback=?&count=5",
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      type: "GET"
   });
}

/*
 * Ajax API call, querying the specified user's (`userID` parameter) latest published media.
 * Doesn't matter if the latest media was a video.
 */
function getUserMedia(userID) {
   return $.ajax({
      url: "https://api.instagram.com/v1/users/" + userID + "/media/recent/?client_id=" + clientID + "&callback=?&count=1",
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      type: "GET"
   });
}

/*
 * Ajax API call, querying information about the specified user (`userID` parameter)
 */
function getUserInfo(userID) {
   return $.ajax({
      url: "https://api.instagram.com/v1/users/" + userID + "/?client_id=" + clientID + "&callback=?",
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      type: "GET"
   });
}

/*
 * Shortening big numbers
 */
function shortNumber(n) {
   if (n > 999999999)
      return Math.floor(n/1000000000) + "B +";
   if (n > 999999)
      return Math.floor(n/1000000) + "M +";
   else if (n > 9999)
      return Math.floor(n/1000) + "K +";
   else
      return n + "";
}

/*
 * This function is called when an error occures during/after an API call.
 * It'll change the loading animation color to RED!
 */
function displayError(loader) {
   $(loader).css('background-color', 'red');
}

/*
 * Making the popup box
 */
function popUpProfile() {
   var position = $(this).position();
   var height = $(this).height();
   var userName = $(this).text();
   var userID;
   var docWidth = $(document).width();
   
   /*
    * If there is no text inside the tags -> return
    */
   if($('.qsmq.' + userName).length) return;
   
   /* The "main" `div` of the popup box */
   var popup = document.createElement('div');
   $(popup).addClass('qsmq popup loading ' + userName)
      .css( 'left', position.left )
      .css( 'top', position.top );
         
      /* Popup box header */
      var header = document.createElement('div');
      $(header).addClass('qsmq-header');
      
         /* `div` containing the profile picture */
         var profPicDiv = document.createElement('div');
         $(profPicDiv).addClass('prof-pic');
            
            /* `img` displaying the profile picture */
            var profPic = new Image();
            
            /* `div` for the loading animation */
            var profLdr = document.createElement('div');
            $(profLdr).addClass('prof-ldr');
            
         $(profPicDiv).append(profPic)
            .append(profLdr);
         
         /* `a` containing the user name */
         var profName = document.createElement('a');
         $(profName).addClass('prof-name');
         
      $(header).append(profPicDiv)
         .append(profName);
   
   $(popup).append(header);
   
      /* The "body" `div` of the popup box */
      var body = document.createElement('div');
      $(body).addClass('qsmq-body');
      
         /* `a` containing the user's website */
         var webLink = document.createElement('a');
         $(webLink).addClass('prof-web');
            
      $(body).append(webLink);
      
   $(popup).append(body);
   
      /* The "footer" `div` of the popup box */
      var footer = document.createElement('div');
      $(footer).addClass('qsmq-footer');
      
         /* `div` containing the user's biography */
         var profBio = document.createElement('div');
         /* `span`s containing the number of posts, followers and followings */
         var profPost = document.createElement('span');
         var profFlwr = document.createElement('span');
         var profFlwi = document.createElement('span');
   
      $(footer).append(profBio)
         .append(profPost)
         .append(profFlwr)
         .append(profFlwi);
   
   $(popup).append(footer);
   
   
   $('body').append( popup );
   
   /* Positioning the popup box */
   $(popup).css('top', position.top + height / 2);
   
   /* Adding an event listening to the popup box. Clicking the box will destroy it. */
   $(popup).on("click", function () {
      $(this).remove();
   });

   /* 1. API call, searching the user */
   searchUser(userName).done(function(result) {
      /* Checking if the API call was successful */
      if(result.meta.code!=200) {
         displayError(profLdr);
         return;
      }
      
      userID = result.data[0].id;
      
      /* 2. API call, querying the user's latest media */
      getUserMedia(userID).done(function(result) {
         /* Checking if the API call was successful */
         if(result.meta.code!=200) {
            displayError(profLdr);
            return;
         }   
         
         // Setting the background image of the popup box
         $(popup).css('background-image', 'url('+result.data[0].images.low_resolution.url+')');
         
         // Setting the source of the profile picture
         profPic.src = result.data[0].user.profile_picture;   
         
         /* Changing the popup box' class to stop the loading animation */
         $(popup).removeClass().addClass('qsmq popup loaded ' + userName);
         
         
         /* 3. API call, querying information about the user */
         getUserInfo(userID).done(function(result) {
            /* Checking if the API call was successful */
            if(result.meta.code!=200) {
               displayError(profLdr);
               return;
            }   
         
            /* 
             * Settin the content of the `a` and it's `href` attribute, 
             * containing the user's name and linking to the user's profile page
             */
            $(profName).append(result.data.full_name);
            $(profName).attr('href', 'http://instagram.com/' + userName )
               .attr('target', '_blank');
               
            /* 
             * Settin the content of the `a` and it's `href` attribute, 
             * containing the user's website link and linking to there
             */
            var webLinkUrl = result.data.website;
            
            if (webLinkUrl.length !== 0) {
               $(webLink).attr('href', webLinkUrl)
                  .attr('target', '_blank');
               
               /* 'Shortening the website URL */
               var shortLink = result.data.website;
               shortLink = shortLink.replace('http://','').replace('https://','');
               $(webLink).append(shortLink);
            } else {
               $(body).css('display', 'none');
            }
                  
            /* Setting the profile biography and shortening it if required */
            var biography = result.data.bio;
            if (biography.length > 150)
               biography = biography.substring(0,150) + "...";
               
            $(profBio).append(biography);
            
            /* Setting the `span`s containing the number of posts, followers and followings */
            var posts = shortNumber(result.data.counts.media);
            var flwrs = shortNumber(result.data.counts.follows);
            var flwis = shortNumber(result.data.counts.followed_by);               
            
            $(profPost).append(posts);
            $(profFlwr).append(flwrs);
            $(profFlwi).append(flwis);
            
            /*
             * Get width and position data to prevent positioning the
             * popup box outside of the window
             */
            var popupWidth = $(popup).width();
            var popupPos = $(popup).position();
           
            if( (popupPos.left + popupWidth) > docWidth )
            {
              $(popup).css( 'left', (docWidth - popupWidth) / 2 );
            }
            
            /* 
             * Adding an event listening to the popup box. 
             * Leaving the box with the mouse will destroy it. 
             */
            $(popup).on("mouseleave", function () {
               $(this).remove();
            });
            
         /* If the 3. API call fails .. */
         }).fail(function() {
            displayError(profLdr);
         });
         
      /* If the 2. API call fails .. */
      }).fail(function() {
         displayError(profLdr);
      });
      
   /* If the 1. API call fails .. */
   }).fail(function() {
      displayError(profLdr);
   });

}