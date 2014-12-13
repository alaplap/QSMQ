<?php 
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
   header('Content-Type: application/json');
   
   $cURL = 'https://api.instagram.com/v1/users/search?q='.$_GET['username'].'&client_id='.$_GET['clientid'];

   //open connection
   $oCurl = curl_init();

   //set the url, number of POST vars, POST data
   curl_setopt($oCurl,CURLOPT_URL, $cURL);
   curl_setopt($oCurl,CURLOPT_RETURNTRANSFER, true);

   //execute post
   $cResult = curl_exec($oCurl);
   $cResult = json_decode($cResult, true);

   //close connection
   curl_close($oCurl);
   
   $userID = $cResult["data"][0]["id"];
   
   $cURL2 = 'https://api.instagram.com/v1/users/'.$userID.'/media/recent/?client_id='.$_GET['clientid'];

   //open connection
   $oCurl2 = curl_init();

   //set the url, number of POST vars, POST data
   curl_setopt($oCurl2,CURLOPT_URL, $cURL2);
   curl_setopt($oCurl2,CURLOPT_RETURNTRANSFER, true);

   //execute post
   $cResult2 = curl_exec($oCurl2);
   $cResult2 = json_encode($cResult2);

   //close connection
   curl_close($oCurl2);
   
   echo $cResult2;
?>