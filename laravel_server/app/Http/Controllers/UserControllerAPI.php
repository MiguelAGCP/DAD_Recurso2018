<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Contracts\Support\Jsonable;

use App\Http\Resources\User as UserResource;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

use App\User;
use App\StoreUserRequest;
use Hash;
use Carbon\Carbon;

//use Intervention\Image\ImageManager;
use Image;


class UserControllerAPI extends Controller
{
    public function getUsers(Request $request)
    {
        if ($request->has('page')) {
            return UserResource::collection(User::paginate(5));
        } else {
            return UserResource::collection(User::all());
        }
    }

    public function getUser($id)
    {
        return new UserResource(User::find($id));
    }

    public function store(Request $request)
    {
        $request->validate([
                'name' => 'required',
                'nickname' => 'required|unique:users,nickname',
                'email' => 'required|email|unique:users,email',
                'password' => 'min:3'
            ]);
       

        $user = new User();
        $user->fill($request->all());
        $user->password = Hash::make($user->password);
        $user->save();
        return response()->json(new UserResource($user), 201);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
                'name' => 'required',
                'email' => 'required|email|unique:users,email,'.$id,
            ]);
        $user = User::findOrFail($id);
        $user->update($request->all());
        return new UserResource($user);
    }


    
    public function validatePass(Request $request, $id)
    {
        $oldPass = $request->password;
        $hashedPassword = DB::table('users')->where('id', '=',$id)->value('password');
        if (Hash::check( $oldPass, $hashedPassword))
        return response()->json(['msg'=>'ok'], 200);
        else
        return response()->json(['msg'=>'error'], 200);
       
    }



    public function updatePass(Request $request, $id)
    {

           $request->validate([
                'password' => 'min:3'
            ]);
       
        $user = User::findOrFail($id);
        $user->password = (Hash::make($request->password));
        $user->save();
        return new UserResource($user);
      
    }


    public function getUserByMail(Request $request, $email)
    {
   
        return DB::table('users')->where('email', '=', $email)->get();
        
    }


    public function getUserByNick(Request $request, $nickname)
    {
           return DB::table('users')->where('nickname', '=',$nickname)->get();
        
    }

    public function updateAvatar(Request $request, $id){
        
        $validator = Validator::make($request->all(), [
            'image' => 'required|image64:jpeg,jpg,png'
        ]);
        if ($validator->fails()) {
            return response()->json(['errors'=>$validator->errors()]);
        } else {
            $imageData = $request->get('image');
            $fileName = Carbon::now()->timestamp . '_' . uniqid() . '.' . explode('/', explode(':', substr($imageData, 0, strpos($imageData, ';')))[1])[1];
            Image::make($request->get('image'))->save(public_path('img/avatars/').$fileName);

            $user = User::findOrFail($request->id);
    		$user->avatar = $fileName;
    		$user->save();

            return response()->json(['error'=>false]);
        }
    }



 
    public function delete(Request $request)
    {
        $user = User::findOrFail($id);
        $user->delete();
        return response()->json(null, 204);

    }
    public function emailAvailable(Request $request)
    {
        $totalEmail = 1;
        if ($request->has('email') && $request->has('id')) {
            $totalEmail = DB::table('users')->where('email', '=', $request->email)->where('id', '<>', $request->id)->count();
        } else if ($request->has('email')) {
            $totalEmail = DB::table('users')->where('email', '=', $request->email)->count();
        }
        return response()->json($totalEmail == 0);
    }


    public function getBlockedUsers (Request $request){

        return DB::table('users')->where('blocked', '=', '1')->get();

    }

    public function contUsers (Request $request){

        return UserResource::collection(User::all())->count();
    }
    public function getAvatar (Request $request, $id){

        return DB::table('users')->where('id', $id)->pluck('avatar');

    }


    

    // FROM: https://laracasts.com/discuss/channels/laravel/validate-access-token-from-controller
    
    public function validateToken(Request $request, $localCall = false) {
    
    
        $psr = (new DiactorosFactory)->createRequest($request);
 
        try {
            $psr = $this->server->validateAuthenticatedRequest($psr);
 
        
            $token = $this->tokens->find(
                $psr->getAttribute('oauth_access_token_id')
            );
 
            $currentDate = new DateTime();
            $tokenExpireDate = new DateTime($token->expires_at);
            $isAuthenticated = $tokenExpireDate > $currentDate ? true : false;
      
 
             return $isAuthenticated;
        
        } catch (OAuthServerException $e) {
            if($localCall) {
                return false;
            }
            else {
                return json_encode(array('error' => 'Something went wrong with authenticating. Please logout and login again.'));
            }
        }
     }
}
