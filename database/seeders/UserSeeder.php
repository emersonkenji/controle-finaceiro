<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (!User::where('email', 'emerson@gmail.com')->first()) {
            User::create([
                'name' => 'emerson',
                'email' => 'emerson@gmail.com',
                'password' => Hash::make('12345678', ['rounds' => 12])
            ]);
        }
        if (!User::where('email', 'kenji_ekt@yahoo.com.br')->first()) {
            User::create([
                'name' => 'emerson',
                'email' => 'kenji_ekt@yahoo.com.br',
                'password' => Hash::make('12345678', ['rounds' => 12])
            ]);
        }

    }
}
