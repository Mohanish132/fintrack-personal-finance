// Transaction Data
let transactions=
JSON.parse(localStorage.getItem("transactions")) || [
{
  id:1,
  title:"Salary",
  amount:50000,
  type:"income",
  category:"Salary",
  date:"2026-08-01"
},
{
  id:2,
  title:"Grocery",
  amount:1500,
  type:"expense",
  category:"Food",
  date:"2026-08-05"
}
];
console.log(transactions);

// Calculate Financial Summary
function calculateSummary(){
  let totalIncome=0;
  let totalExpenses=0;

  transactions.forEach(transaction =>{
    if(transaction.type==="income"){
      totalIncome+=transaction.amount;
    } else if(transaction.type==="expense"){
      totalExpenses+=transaction.amount;
    }
  });

  const totalBalance=totalIncome-totalExpenses;

  // Update Dashboard
const incomeElement=document.getElementById("total-income");
const expenseElement=document.getElementById("total-expenses");
const balanceElement=document.getElementById("total-balance");

if(incomeElement){
  incomeElement.textContent=`₹${totalIncome}`;
}
if(expenseElement){
  expenseElement.textContent=`₹${totalExpenses}`;
}
if(balanceElement){
  balanceElement.textContent=`₹${totalBalance}`;
}

console.log("Total Income:", totalIncome);
console.log("Total Expenses:", totalExpenses);
console.log("Total Balance:", totalBalance);
}
calculateSummary();

// Recent Transactions
function displayRecentTransactions(){
  const transactionList=document.getElementById("recent-transactions-list");
  if(!transactionList){
    return;
  }
transactionList.innerHTML="";

// transactions.forEach(transaction =>{
//   const transactionElement=document.createElement("div");

const recentTransactions=[...transactions].sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0,5);
recentTransactions.forEach(transaction =>{
  const transactionElement=document.createElement("div");
  transactionElement.innerHTML=`
  <p>${transaction.title}</p>
  <p>${transaction.category}</p>
  <p>${transaction.type==="income" ? "+" : "-"}₹${transaction.amount}</p
  `;

  transactionList.appendChild(transactionElement);
});
}
displayRecentTransactions();

// Expense Overview Chart
function displayExpenseChart(){
  const chartContainer=document.getElementById("expense-chart");

  if(!chartContainer){
    return;
  }
  chartContainer.innerHTML="";
  const expenseByCategory={};

  transactions.filter(transaction => transaction.type==="expense").forEach(transaction=>{
    const category=transaction.category;

    if(!expenseByCategory[category]){
      expenseByCategory[category]=0;
    }
    expenseByCategory[category]+=Number(transaction.amount);
  });
  const categories=Object.entries(expenseByCategory);
  if(categories.length===0){
    chartContainer.innerHTML="<p>No expenses available.</p>";
    return;
  }
  const maxAmount=Math.max(...categories.map(([category, amount])=> amount));
  categories.forEach(([category, amount])=> {
    const row=document.createElement("div");
    row.className="expense-chart-row";

    const label=document.createElement("div");
    label.className="expense-chart-label";
    label.textContent=category;

    const barWrapper=document.createElement("div");
    barWrapper.className="expense-bar-wrapper";
    
    const bar=document.createElement("div");
    bar.className="expense-bar";

    bar.style.width=`${(amount / maxAmount)*100}%`;

    const value=document.createElement("span");
    value.className="expense-chart-value";
    value.textContent=`₹${amount}`;

    barWrapper.appendChild(bar);
    barWrapper.appendChild(value);
    row.appendChild(label);
    row.appendChild(barWrapper);
    chartContainer.appendChild(row);
  });
}
displayExpenseChart();

// Add Transaction functionality

const form=document.getElementById("transaction-form");
let editingTransactionId=null;

const savedEditingId=localStorage.getItem("editingTransactionId");

if(savedEditingId){
  const transaction=transactions.find(transaction => transaction.id===Number(savedEditingId));
  if(transaction){
    editingTransactionId=transaction.id;

    document.getElementById("type").value=transaction.type;
    document.getElementById("title").value=transaction.title;
    document.getElementById("amount").value=transaction.amount;
    document.getElementById("category").value=transaction.category;
    document.getElementById("date").value=transaction.date;
    document.getElementById("description").value=transaction.description;
  }
  localStorage.removeItem("editingTransactionId");
}

if(form){
form.addEventListener("submit", function (event){
  event.preventDefault();

  const type=document.getElementById("type").value;
  const title=document.getElementById("title").value;
  const amount=document.getElementById("amount").value;
  const category=document.getElementById("category").value;
  const date=document.getElementById("date").value;
  const description=document.getElementById("description").value;

  console.log(type);
  console.log(title);
  console.log(amount);
  console.log(category);
  console.log(date);
  console.log(description);

if(editingTransactionId!==null){
  const transaction=transactions.find(transaction => transaction.id===editingTransactionId);

  if(transaction){
    transaction.type=type;
    transaction.title=title;
    transaction.amount=Number(amount);
    transaction.category=category;
    transaction.date=date;
    transaction.description=description;
  }
  editingTransactionId=null;
} else {
const transaction={
    id: Date.now(),
    type: type,
    title: title,
    amount: Number(amount),
    category: category,
    date: date,
    description: description
  };
  transactions.push(transaction);
}

  localStorage.setItem("transactions",
  JSON.stringify(transactions));
  
  displayRecentTransactions();
  displayAllTransactions();

  console.log("New Transaction:", transaction);
  console.log("All Transaction:", transactions);

});
}

// Display All Transactions
function displayAllTransactions(transactionData=transactions){
const transactionsList=document.getElementById("transactions-list");
if(!transactionsList){
  return;
}
  transactionsList.innerHTML="";

  transactionData.forEach(transaction =>{
    const transactionElement=document.createElement("div");

transactionElement.classList.add(
  transaction.type==="income" ? "income" : "expense"
);

    transactionElement.innerHTML=`
    <h3>${transaction.title}</h3>
    <p>${transaction.category}</p>
    <p>${transaction.date}</p>
    <p class="${transaction.type}">
    ${transaction.type ==="income" ? "+" : "-"}₹${transaction.amount}
    </p>

    <button
    onclick="editTransaction(${transaction.id})">
      Edit
      </button>

    <button
    onclick="deleteTransaction(${transaction.id})">
      Delete
      </button>
    `;

    transactionsList.appendChild(transactionElement);
  })
}
displayAllTransactions();

const searchInput=document.getElementById("search-input");
const typeFilter=document.getElementById("type-filter");
const sortFilter=document.getElementById("sort-filter");


function filterTransactions(){
  const searchText=searchInput.value.toLowerCase();
  const selectedType=typeFilter.value;
  const selectedSort=document.getElementById("sort-filter").value;

  let filteredTransactions=transactions.filter(transaction =>{
    const matchesSearch= transaction.title.toLowerCase().includes(searchText) || 
    transaction.category.toLowerCase().includes(searchText);

    const matchesType=selectedType==="all" || transaction.type===selectedType;
    return matchesSearch && matchesType;
  });
  // Sort transactions
  filteredTransactions.sort((a,b)=>{
    if(selectedSort==="newest"){
      return new Date(b.date) - new Date(a.date);
    }
    if(selectedSort==="oldest"){
      return new Date(a.date) - new Date(b.date);
    }
    if(selectedSort==="high"){
      return b.amount - a.amount;
    }
    if(selectedSort==="low"){
      return a.amount - b.amount;
    }
  });
  displayAllTransactions(filteredTransactions);
}
if(sortFilter){
  sortFilter.addEventListener("change", filterTransactions);
}
if(searchInput){
  searchInput.addEventListener("input", filterTransactions);
}
if(typeFilter){
  typeFilter.addEventListener("change", filterTransactions);
}

function deleteTransaction(id){
  transactions=transactions.filter(transaction => transaction.id!==id);

  localStorage.setItem("transactions", JSON.stringify(transactions));
  console.log("Transaction deleted:", id);
  console.log("Updated transactions:", transactions);

  calculateSummary();
  displayRecentTransactions();
  displayAllTransactions();
}

function editTransaction(id){
  const transaction=transactions.find(transaction => transaction.id===id);

   if(!transaction){
       return;
 }
  // editingTransactionId=id;

  // document.getElementById("type").value=transaction.type;
  // document.getElementById("title").value=transaction.title;
  // document.getElementById("amount").value=transaction.amount;
  // document.getElementById("category").value=transaction.category;
  // document.getElementById("date").value=transaction.date;
  // document.getElementById("description").value=transaction.description;
  localStorage.setItem("editingTransactionId", transaction.id);
  window.location.href="add-transaction.html";
}