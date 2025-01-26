<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Carrier extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'document',
        'contact_name',
        'contact_phone',
        'contact_email',
        'address',
        'city',
        'state',
        'zip_code',
        'status',
        'notes'
    ];

    public function deliveries()
    {
        return $this->hasMany(Delivery::class);
    }

    public function getFormattedPhoneAttribute()
    {
        if (!$this->contact_phone) {
            return null;
        }
        $phone = preg_replace('/[^0-9]/', '', $this->contact_phone);
        $ddd = substr($phone, 0, 2);
        $number = substr($phone, 2);
        if (strlen($phone) === 10) {
            return "($ddd) " . substr($number, 0, 4) . '-' . substr($number, 4);
        } elseif (strlen($phone) === 11) {
             return "($ddd) " . substr($number, 0, 5) . '-' . substr($number, 5);
        }
        return $this->contact_phone;
    }
}
