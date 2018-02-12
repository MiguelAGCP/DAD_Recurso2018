<!DOCTYPE html>
<html lang="{{ config('app.locale') }}">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        @yield('metatags') 
        <title>@yield('title')</title>
        @yield('extrastyles') 
        <!-- Latest compiled and minified CSS & JS -->
        <link rel="stylesheet" href="{{ URL::asset('css/app.css') }}">
        <link rel="stylesheet" href="https://unpkg.com/element-ui/lib/theme-chalk/index.css">
        </head> 
        <body>
        <div class="container" id="app">
            @yield('content')
        </div>

     @yield('pagescript')        
    </body>
</html>


<style>
body.login {
    background-image: url("https://images4.alphacoders.com/155/155784.jpg");
}
body.index {
    background-image: url("https://images4.alphacoders.com/155/155784.jpg");
}
body.login {
    background-image: url("https://images4.alphacoders.com/155/155784.jpg");
}
body.dash {
    background-image: url("");
}
</style>