fetch('http://127.0.0.1:5000/report/')
  .then(response => response.json())
  .then(data => {
    const reportTable = document.querySelector('#report tbody');
    
    // Populate the most requested ingredient field
    reportTable.querySelector('.requested-ingredient').innerText = getIngredientName(data.popular_ingredients[0]);
    
    // Populate the month with more revenue field
    reportTable.querySelector('.month-more-revenue').innerText = data.month_with_more_sales;
    
    // Populate the top 3 customers field
    const topCustomers = data.best_customers;
    topCustomers.forEach((customer, index) => {
      const template = document.createElement('template');
      template.innerHTML = `
        <td class="col-3 text-center">${customer.client_name}</td>
        <td class="col-3 text-center">${customer.total_spending} $</td>
      `;
      const clone = template.content.cloneNode(true);
      reportTable.querySelector(`.top-customer-${index+1}`).appendChild(clone);
      if (index === 2) return;
    });
  });

  const getIngredientName = (id) => {
    ingredient = {
      1: 'Mozzarella Cheese',
      2: 'Tomatoes',
      3: 'Pepperoni',
      4: 'Mushrooms',
      5: 'Onions',
      6: 'Green Peppers',
      7: 'Olives',
      8: 'Bacon',
      9: 'Ham',
      10: 'Pineapple',
      11: 'Jalapeños',
      12: 'Garlic',
      13: 'Basil',
      14: 'Oregano',
      15: 'Red Pepper Flakes',
  }

  return ingredient[id]

  }