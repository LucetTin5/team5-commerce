const getOrders = async () => {
  const { orders } = await (
    await fetch('/api/orders', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
    })
  ).json();
  return orders;
};

const createHistoryDiv = ({ _id, summaryTitle, totalPrice, status }) => {
  const historyDetail = document.createElement('div');
  historyDetail.className = 'flex-justify-between payment_history_detail';
  historyDetail.dataset.id = _id;
  const historyBody = `
    <span class="order_number">
      <a href="/orders/${_id}">${_id}</a>
    </span>
    <span class="order_title">${summaryTitle}</span>
    <span class="order_status">${status}</span>
    <span class="order_total_price">${totalPrice.toLocaleString(
      'ko-kr',
    )}원</span>
    `;
  historyDetail.innerHTML = historyBody;

  return historyDetail;
};

const init = async () => {
  const paymentHistoryBody = document.querySelector('.payment_history_body');

  paymentHistoryBody.innerHTML = '';
  const orders = await getOrders();
  orders.forEach((order) => {
    paymentHistoryBody.appendChild(createHistoryDiv(order));
  });
};

document.addEventListener('DOMContentLoaded', init);
