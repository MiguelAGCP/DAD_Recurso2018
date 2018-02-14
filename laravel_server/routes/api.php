<?php

use Illuminate\Http\Request;
use Illuminate\Contracts\Support\Jsonable;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('login', 'LoginControllerAPI@login');

Route::post('login', 'LoginControllerAPI@login');

Route::post('storeuser', 'UserControllerAPI@store');

Route::get('users/getAvatar/{id}', 'UserControllerAPI@getAvatar')->middleware('auth:api');
Route::post('logout', 'LoginControllerAPI@logout');
Route::get('users/getuserbymail/{email}', 'UserControllerAPI@getUserByMail')->middleware('auth:api');
Route::get('users/getuserbynick/{email}', 'UserControllerAPI@getUserByNick')->middleware('auth:api');
Route::get('users/getblockedusers', 'UserControllerAPI@getBlockedUsers');
Route::get('users', 'UserControllerAPI@getUsers');
Route::get('users/contusers', 'UserControllerAPI@contUsers');
Route::get('users/emailavailable', 'UserControllerAPI@emailAvailable');
Route::get('users/{id}', 'UserControllerAPI@getUser');
Route::post('users', 'UserControllerAPI@store');
Route::put('users/{id}', 'UserControllerAPI@update');
Route::post('users/validatepass/{id}', 'UserControllerAPI@validatePass');
Route::put('users/updatepass/{id}', 'UserControllerAPI@updatePass')->middleware('auth:api');
Route::post('users/updateavatar/{id}', 'UserControllerAPI@updateAvatar');

Route::delete('users/', 'UserControllerAPI@delete');
 
Route::get('games/countusergames/{userid}','GameControllerAPI@countUserGames')->middleware('auth:api');
Route::get('games/countuservictories/{userid}','GameControllerAPI@countUserVictories')->middleware('auth:api');
Route::get('games/countuserdraws/{userid}','GameControllerAPI@countUserDraws');
Route::get('games/countuserdefeats/{userid}','GameControllerAPI@countUserDefeats')->middleware('auth:api');
Route::get('games/countuserscore/{userid}','GameControllerAPI@countUserScore')->middleware('auth:api');
Route::get('games/countuseravg/{userid}','GameControllerAPI@countUserAvg')->middleware('auth:api');
Route::get('games/gettop5games','GameControllerAPI@getTop5Games')->middleware('auth:api');
Route::get('games/gettop5scores','GameControllerAPI@getTop5Scores')->middleware('auth:api');
Route::get('games/gettop5average','GameControllerAPI@getTop5Avg')->middleware('auth:api');
Route::get('games/canceledgames','GameControllerAPI@canceledGames')->middleware('auth:api');
Route::get('games/terminatedgames','GameControllerAPI@terminatedGames')->middleware('auth:api');
Route::get('games/pendgames','GameControllerAPI@pendingGames')->middleware('auth:api');
Route::get('games/activegames','GameControllerAPI@activeGames')->middleware('auth:api');
Route::get('games', 'GameControllerAPI@index');
Route::get('games/lobby', 'GameControllerAPI@lobby');
Route::get('games/status/{status}', 'GameControllerAPI@gamesStatus');
Route::get('games/{id}', 'GameControllerAPI@getGame');
Route::post('games', 'GameControllerAPI@store');

Route::patch('games/{id}/join-start', 'GameControllerAPI@joinAndStart');
Route::patch('games/{id}/endgame/{winner}', 'GameControllerAPI@endgame');

Route::get('games/winner/{user}','GameControllerAPI@gamesByWinner');
Route::delete('games/deleteallgames','GameControllerAPI@deleteAllGames');
Route::delete('games/deletegamebystatus/{status}','GameControllerAPI@deleteGamesByStatus');