const backendUrl = 'http://localhost:3000';

// cache
const verticalEl = document.getElementById('search-vertical');
const sortByEl = document.getElementById('search-sortBy');
const marketEl = document.getElementById('search-market');
const advertiserEl = document.getElementById('search-advertiser');
const analystEl = document.getElementById('search-analyst');
const primaryTagEl = document.getElementById('primaryTag');
const secondaryTagEl = document.getElementById('secondaryTag');
const filterBtnEl = document.getElementById('btn-filter');
const searchFilterEl = document.getElementById('search-filter');
const filenameInputEl = document.getElementById('search-filename');
const searchBtnEl = document.getElementById('btn-search');
const tableEl = document.getElementById('search-result');

axios
  .get(`${backendUrl}/verticals`)
  .then(res => {
    console.log(res);
    const verticals = res.data;
    verticals.unshift('none');
    verticals.forEach(vertical => {
      const node = document.createElement('option');
      node.value = vertical;
      node.innerText = vertical;
      verticalEl.appendChild(node);
    });
  })
  .catch(err => console.error(err));

axios
  .get(`${backendUrl}/markets`)
  .then(res => {
    console.log(res);
    const markets = res.data;
    markets.unshift('none');
    markets.forEach(market => {
      const node = document.createElement('option');
      node.value = market;
      node.innerText = market;
      marketEl.appendChild(node);
    });
  })
  .catch(err => console.error(err));

axios
  .get(`${backendUrl}/advertisers`)
  .then(res => {
    console.log(res);
    const advertisers = res.data;
    advertisers.unshift('none');
    advertisers.forEach(advertiser => {
      const node = document.createElement('option');
      node.value = advertiser;
      node.innerText = advertiser;
      advertiserEl.appendChild(node);
    });
  })
  .catch(err => console.error(err));

axios
  .get(`${backendUrl}/analysts`)
  .then(res => {
    console.log(res);
    const analysts = res.data;
    analysts.unshift('none');
    analysts.forEach(analyst => {
      const node = document.createElement('option');
      node.value = analyst;
      node.innerText = analyst;
      analystEl.appendChild(node);
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

filterBtnEl.addEventListener('click', evt => {
  if (searchFilterEl.classList.contains('hide')) {
    searchFilterEl.classList.remove('hide');
  } else {
    searchFilterEl.classList.add('hide');
  }
});

searchBtnEl.addEventListener('click', evt => {
  console.log('searching', search());
});

sortByEl.addEventListener('change', evt => {
  sortSearch(evt.target.value, window.data);
});

function sortSearch(sortBy, data) {
  while (tableEl.firstChild) {
    tableEl.removeChild(tableEl.firstChild);
  }

  let sortedData = [];

  switch (sortBy) {
    case 'insightName':
      sortedData = data.sort((a, b) => a.file.fileName.name > b.file.fileName.name);
      break;

    case 'uploadDate':
      sortedData = data.sort(
        (a, b) =>
          new Date(a.file.fileName.lastModifiedDate) > new Date(b.file.fileName.lastModifiedDate)
      );
      break;

    case 'analyst':
      sortedData = data.sort((a, b) => {
        return a.analyst > b.analyst;
      });
      break;
  }

  sortedData.forEach((doc, idx) => {
    const rowEl = tableEl.insertRow(idx);
    rowEl.insertCell(0).innerHTML = `<a href="${doc.file.fileName.path}" download="${
      doc.file.fileName.name
    }">${doc.file.fileName.name}</a>`;
    rowEl.insertCell(1).innerText = new Date(
      doc.file.fileName.lastModifiedDate
    ).toLocaleDateString();
    rowEl.insertCell(2).innerText = doc.analyst;
    rowEl.insertCell(3).innerText = doc.primaryTags.concat(doc.secondaryTags);
  });
}

function search() {
  const pTags = document.querySelectorAll('#primaryTag .selected');
  const sTags = document.querySelectorAll('#secondaryTag .selected');
  const pTagList = [];
  const sTagList = [];

  pTags.forEach(el => pTagList.push(el.value));
  sTags.forEach(el => sTagList.push(el.value));

  var data = {
    vertical: verticalEl.value === 'none' ? null : verticalEl.value,
    market: marketEl.value === 'none' ? null : marketEl.value,
    advertiser: advertiserEl.value === 'none' ? null : advertiserEl.value,
    analyst: analystEl.value === 'none' ? null : analystEl.value,
    primaryTags: pTagList,
    secondaryTags: sTagList,
    filename: filenameInputEl.value === '' ? null : filenameInputEl.value
  };

  axios({
    method: 'get',
    url: `${backendUrl}/insights`,
    params: data
  })
    .then(res => {
      window.data = res.data;

      while (tableEl.firstChild) {
        tableEl.removeChild(tableEl.firstChild);
      }

      if (res.data.length === 0) {
        alert('no matching insights found');
        return;
      }

      const sortBy = sortByEl.value;
      console.log('DEBUG sortBy', sortBy);

      sortSearch(sortBy, res.data);
    })
    .catch(err => console.error(err));

  return data;
}
