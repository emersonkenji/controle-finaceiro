<?php

use App\Models\Setting;
use Illuminate\Support\Facades\Cache;

if (!function_exists('setting')) {
    function setting($key, $default = null)
    {
        // Tenta buscar do cache primeiro
        $value = Cache::tags('settings')->remember("setting.{$key}", 3600, function () use ($key) {
            return Setting::where('key', $key)->value('value');
        });

        return $value ?? $default;
    }
}

if (!function_exists('settings')) {
    function settings($group)
    {
        // Retorna todas as configurações de um grupo
        return Cache::tags('settings')->remember("settings.{$group}", 3600, function () use ($group) {
            return Setting::where('group', $group)
                ->pluck('value', 'key')
                ->toArray();
        });
    }
}
