<?php

use App\Models\Setting;
use Illuminate\Support\Facades\Cache;

if (!function_exists('setting')) {
    function setting($key, $default = null)
    {
        $cacheKey = 'setting.' . $key;

        return Cache::tags('settings')->remember($cacheKey, now()->addDay(), function () use ($key, $default) {
            $parts = explode('.', $key);
            $group = $parts[0];
            $setting = Setting::where('group', $group)
                ->where('key', $parts[1] ?? '')
                ->first();

            return $setting ? $setting->value : $default;
        });
    }
}
