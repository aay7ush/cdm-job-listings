const renderJob = (entry) => {
  const main = document.querySelector('main')
  const section = document.createElement('section')
  section.setAttribute('class', 'job')

  section.innerHTML = `
      <div class="logo">
          <img src=${entry.logo} alt="company logo" />
      </div>
      <div class="my-4 lg:ml-24">
        <p class="company">${entry.company}</p>
        <p class="position">${entry.position}</p>
        <div class="detail">
          <p>${entry.postedAt}</p>
          <p>${entry.contract}</p>
          <p>${entry.location}</p>
        </div>
      </div>

      <div class="skills">
        ${entry.skills
          .map((skill) => `<button class="filter-btn">${skill}</button>`)
          .join('')}
      </div>
  `
  main.append(section)
}

document.addEventListener('DOMContentLoaded', async () => {
  const res = await fetch('../data.json')
  const data = await res.json()
  data.map((entry) => renderJob(entry))

  const filterButtons = document.querySelectorAll('button.filter-btn')

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => setFilter(button))
  })

  loadFilters()
  removeFilter()
})

const setFilter = (button) => {
  const filterBox = document.querySelector('#filter-box')

  if (filterBox.classList.contains('hidden')) {
    filterBox.classList.replace('hidden', 'flex')
  }

  const existingFilters = filterBox.querySelectorAll('.filter')
  const filterText = button.textContent
  const filterExists = Array.from(existingFilters).some(
    (existingFilter) => existingFilter.textContent.trim() === filterText
  )

  if (!filterExists) {
    addFilterToBox(filterText)
  }

  filterJobs()
  saveFilters()
}

const addFilterToBox = (filterText) => {
  const filterBox = document.querySelector('#filter-box')

  if (filterBox.classList.contains('hidden')) {
    filterBox.classList.replace('hidden', 'flex')
  }

  filterBox.innerHTML += `<div class="filter">
    <span class="filter-text">${filterText}</span>
    <button class="remove-btn">
      <img src="../assets/cross-icon.svg" alt="remove icon" />
    </button>
  </div>`
}

const filterJobs = () => {
  const selectedFilters = Array.from(document.querySelectorAll('.filter')).map(
    (filter) => filter.textContent.trim()
  )
  const jobs = document.querySelectorAll('.job')

  if (selectedFilters.length === 0) {
    jobs.forEach((job) => {
      job.classList.remove('hidden')
    })
  } else {
    jobs.forEach((job) => {
      const jobFilters = Array.from(job.querySelectorAll('.filter-btn')).map(
        (filter) => filter.textContent.trim()
      )

      if (selectedFilters.every((filter) => jobFilters.includes(filter))) {
        job.classList.remove('hidden')
      } else {
        job.classList.add('hidden')
      }
    })
  }
}

const removeFilter = () => {
  const filterBox = document.querySelector('#filter-box')

  filterBox.addEventListener('click', (e) => {
    if (
      e.target.parentNode.classList.contains('remove-btn') ||
      e.target.classList.contains('remove-btn')
    ) {
      e.target.closest('.filter').remove()
    }
    if (filterBox.childElementCount === 0) {
      filterBox.classList.replace('flex', 'hidden')
    }
    filterJobs()
    saveFilters()
  })
}

const saveFilters = () => {
  const selectedFilters = Array.from(document.querySelectorAll('.filter')).map(
    (filter) => filter.textContent.trim()
  )
  localStorage.setItem('selectedFilters', JSON.stringify(selectedFilters))
}

function loadFilters() {
  const selectedFilters = JSON.parse(localStorage.getItem('selectedFilters'))
  if (selectedFilters) {
    selectedFilters.forEach((filterText) => {
      addFilterToBox(filterText)
    })
    filterJobs()
  }
}
