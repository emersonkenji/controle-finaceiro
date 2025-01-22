use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->string('description');
            $table->decimal('amount', 10, 2);
            $table->date('due_date');
            $table->date('paid_date')->nullable();
            $table->string('type'); // receivable, payable
            $table->string('status')->default('pending'); // pending, paid, cancelled, overdue
            $table->string('payment_method')->nullable();
            $table->integer('installment_number')->nullable();
            $table->integer('total_installments')->nullable();
            $table->foreignId('category_id')->constrained()->restrictOnDelete();
            $table->foreignId('cost_center_id')->constrained()->restrictOnDelete();
            $table->foreignId('bank_reconciliation_id')->nullable()->constrained('bank_statements')->nullOnDelete();
            $table->timestamp('reconciled_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down()
    {
        Schema::dropIfExists('transactions');
    }
};
