var chart;

function calculateLoan() {
    var loanAmount = document.getElementById('loan-amount').value;
    var interestRate = document.getElementById('interest-rate').value;
    var loanTerm = document.getElementById('loan-term').value;

    var monthlyInterestRate = interestRate / 100 / 12;

    var monthlyPayment = loanAmount * monthlyInterestRate / (1 - Math.pow(1 + monthlyInterestRate, -loanTerm));
    var principalAmounts = [];
    var interestAmounts = [];

    var remainingBalance = loanAmount;
    for (var i = 0; i < loanTerm; i++) {
        var interest = remainingBalance * monthlyInterestRate;
        var principal = monthlyPayment - interest;
        principalAmounts.push(principal);
        interestAmounts.push(interest);
        remainingBalance -= principal;
    }

    var totalInterestAmount = interestAmounts.reduce((acc, val) => acc + val, 0);
    var totalAmountWithInterest = parseFloat(loanAmount) + totalInterestAmount;

    document.getElementById('result').innerHTML = 'Monthly Payment: ₹' + monthlyPayment.toFixed(2);
    document.getElementById('total-interest').innerHTML = 'Total Interest Amount: ₹' + totalInterestAmount.toFixed(2);
    document.getElementById('total-amount').innerHTML = 'Total Amount with Interest: ₹' + totalAmountWithInterest.toFixed(2);

    if (chart) {
        chart.destroy();
    }

    var ctx = document.getElementById('chart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Array.from({ length: loanTerm }, (_, i) => i + 1),
            datasets: [{
                label: 'Principal Amount',
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                data: principalAmounts
            }, {
                label: 'Interest Amount',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                data: interestAmounts
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    stacked: true
                },
                y: {
                    stacked: true
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            var label = context.dataset.label || '';
                            var value = context.dataset.data[context.dataIndex];
                            return label + ': ₹' + value.toFixed(2);
                        }
                    }
                }
            }
        }
    });
}
