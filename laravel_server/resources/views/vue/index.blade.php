@extends('master')

@section('title', 'Vue.js App')

@section('content')

    <router-view></router-view>
@endsection

@section('pagescript')
<script src="js/vueapp.js"></script>
<script src="https://unpkg.com/element-ui/lib/index.js"></script>

 @stop  
