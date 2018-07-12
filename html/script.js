const backendUrl = 'http://localhost:3000';

// var tagsArr = document.getElementsByClassName('tags');

// for (let i = 0; i < tagsArr.length; i++) {
//   tagsArr[i].addEventListener('click', evt => {
//     if (evt.target.classList.contains('selected')) {
//       evt.target.classList.remove('selected');
//     } else {
//       evt.target.classList.add('selected');
//     }
//   });
// }

const advertiserEl = document.getElementById('advertiser');
const analystEl = document.getElementById('analyst');
const marketEl = document.getElementById('market');
const verticalEl = document.getElementById('vertical');
const primaryTagEl = document.getElementById('primaryTag');
const secondaryTagEl = document.getElementById('secondaryTag');
const formEl = document.getElementById('form');
const submitBtnEl = document.getElementById('submit-button');
const loaderEl = document.getElementById('submit-loader');

window.onload = function() {
  axios
    .get(`${backendUrl}/advertisers`)
    .then(res => {
      console.log(res);
      const advertisers = res.data;
      advertisers.forEach(emp => {
        const node = document.createElement('option');
        node.value = emp;
        node.innerText = emp;
        advertiserEl.appendChild(node);
      });
    })
    .catch(err => console.error(err));

  axios
    .get(`${backendUrl}/analysts`)
    .then(res => {
      console.log(res);
      const employees = res.data;
      employees.forEach(emp => {
        const node = document.createElement('option');
        node.value = emp;
        node.innerText = emp;
        analystEl.appendChild(node);
      });
    })
    .catch(err => console.error(err));

  axios
    .get(`${backendUrl}/markets`)
    .then(res => {
      console.log(res);
      const markets = res.data;
      markets.forEach(market => {
        const node = document.createElement('option');
        node.value = market;
        node.innerText = market;
        marketEl.appendChild(node);
      });
    })
    .catch(err => console.error(err));

  axios
    .get(`${backendUrl}/verticals`)
    .then(res => {
      console.log(res);
      const verticals = res.data;
      verticals.forEach(vertical => {
        const node = document.createElement('option');
        node.value = vertical;
        node.innerText = vertical;
        verticalEl.appendChild(node);
      });
    })
    .catch(err => console.error(err));

  axios
    .get(`${backendUrl}/tags`)
    .then(res => {
      console.log(res);
      const primaryTags = res.data.primary;
      const secondaryTags = res.data.secondary;
      primaryTags.forEach(tag => {
        const node = document.createElement('div');
        node.value = tag;
        node.innerText = tag;
        node.classList.add('tag-option');
        node.addEventListener('click', () => {
          if (node.classList.contains('selected')) {
            node.classList.remove('selected');
          } else {
            node.classList.add('selected');
          }
        });
        primaryTagEl.appendChild(node);
      });
      secondaryTags.forEach(tag => {
        const node = document.createElement('div');
        node.value = tag;
        node.innerText = tag;
        node.classList.add('tag-option');
        node.addEventListener('click', () => {
          if (node.classList.contains('selected')) {
            node.classList.remove('selected');
          } else {
            node.classList.add('selected');
          }
        });
        secondaryTagEl.appendChild(node);
      });
    })
    .catch(err => console.error(err));

  formEl.addEventListener('submit', e => {
    e.preventDefault();

    submitBtnEl.disabled = true;
    loaderEl.classList.remove('hidden');

    const data = new FormData(formEl);
    const pTags = document.querySelectorAll('#primaryTag .selected');
    const sTags = document.querySelectorAll('#secondaryTag .selected');
    const pTagList = [];
    const sTagList = [];

    pTags.forEach(el => pTagList.push(el.value));
    sTags.forEach(el => sTagList.push(el.value));

    if (pTagList.length === 0 || sTagList.length === 0) {
      alert('select tags');
      return;
    }

    data.append('primaryTags', pTagList);
    data.append('secondaryTags', sTagList);

    axios({
      method: 'post',
      url: `${backendUrl}/insightRepo`,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data
    })
      .then(res => {
        console.log(res);
        formEl.reset();
        pTags.forEach(el => el.classList.remove('selected'));
        sTags.forEach(el => el.classList.remove('selected'));
        submitBtnEl.disabled = false;
        loaderEl.classList.add('hidden');
        alert('form submitted successfully.');
      })
      .catch(err => {
        console.error(err);
        submitBtnEl.disabled = false;
        loaderEl.classList.add('hidden');
        alert('failed to submit form. Please try again.');
      });
  });
};
