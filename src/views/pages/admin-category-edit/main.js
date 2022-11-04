const $categories = document.querySelector('.categories');
const $selected_category_delete_bnt = document.querySelector(
  '.selected_category_delete_bnt',
);

const elementCreater = (current, add) => {
  current.innerHTML += add;
};

const pageRender = async () => {
  const categories = await getCategory();
  console.log(categories);
  categories.forEach((e) => {
    const { _id, title, description, createdAt, updatedAt } = e;
    const createDate = `${createdAt.substring(0, 10)} ${createdAt.substring(
      11,
      16,
    )}`;
    const updateDate = `${updatedAt.substring(0, 10)} ${updatedAt.substring(
      11,
      16,
    )}`;

    const html_temp = `
      <div class="category_item">
        <form class='edit_form' id=${_id} data-title=${title}>
          <input class='category_checked'type='checkbox' >
          <input name='category-name' value=${title}>
          <input value=${description}>
          <span>${createDate}</span>
          <span>${updateDate}</span>
          <button type='submit'>수정하기</button>
        </form>
      </div>
    `;

    elementCreater($categories, html_temp);
  });

  return document.querySelectorAll('.edit_form');
};

const customFetcher = async (data) => {
  const res = await fetch(`/api/category/${data}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
  });

  // 응답 코드가 4XX 계열일 때 (400, 403 등)
  if (!res.ok) {
    const errorContent = await res.json();
    const { reason } = errorContent;

    throw new Error(reason);
  }
  console.log(res);
  $categories.innerHTML = '';
  await pageRender();
};

const getCategory = async () => {
  const respose = await fetch('/api/categorylist');
  return await respose.json();
};
let obj = {};

const selectedCategoryDelete = (target) => {
  target.addEventListener('click', () => {
    obj[target.parentNode.getAttribute('data-title')] = target.checked;
    console.log(obj);
  });

  // element.addEventListener('click', async () => {
  //   console.log(target.checked);
  //   if (target.checked) {
  //     await customFetcher(target.parentNode.getAttribute('data-title'));
  //   }
  // });
};

const setFormEvent = (element) => {
  element.forEach((e) => {
    selectedCategoryDelete(e[0]);

    e.addEventListener('submit', (event) => {
      event.preventDefault();
      // console.log(event.target.getAttribute('id'));
      const formData = new FormData(e);
      // console.log(formData);
      // console.log(formData.get('category-name'));
      // console.log(formData.get('check'));
    });
  });
};

window.addEventListener('DOMContentLoaded', async () => {
  const $edit_form = await pageRender();
  setFormEvent($edit_form);
});
