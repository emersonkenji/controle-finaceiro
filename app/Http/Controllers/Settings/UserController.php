<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query()
            ->when($request->search, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            });

        $users = $query->latest()->paginate(10);

        return Inertia::render('Settings/Users/Index', [
            'users' => $users,
            'filters' => $request->only(['search'])
        ]);
    }

    public function create()
    {
        return Inertia::render('Settings/Users/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        return redirect()->route('settings.users.index')
            ->with('success', 'Usuário criado com sucesso.');
    }

    public function edit(User $user)
    {
        return Inertia::render('Settings/Users/Edit', [
            'user' => $user
        ]);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => $request->password ? ['required', 'confirmed', Rules\Password::defaults()] : '',
        ]);

        $data = [
            'name' => $validated['name'],
            'email' => $validated['email'],
        ];

        if ($request->password) {
            $data['password'] = Hash::make($validated['password']);
        }

        $user->update($data);

        return redirect()->route('settings.users.index')
            ->with('success', 'Usuário atualizado com sucesso.');
    }

    public function destroy(User $user)
    {
        // Impede a exclusão do próprio usuário
        if ($user->id === auth()->id()) {
            return redirect()->back()
                ->with('error', 'Você não pode excluir seu próprio usuário.');
        }

        $user->delete();

        return redirect()->route('settings.users.index')
            ->with('success', 'Usuário excluído com sucesso.');
    }
}
