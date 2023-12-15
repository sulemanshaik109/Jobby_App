import './index.css'

const FiltersGroup = props => {
  const renderSalaryRangeList = () => {
    const {salaryRangesList} = props

    return salaryRangesList.map(salaryRange => {
      const {changeSalaryRange} = props
      const onClickSalaryInput = event => changeSalaryRange(event.target.value)

      return (
        <li className="filter-item" key={salaryRange.salaryRangeId}>
          <input
            type="radio"
            id={salaryRange.salaryRangeId}
            value={salaryRange.salaryRangeId}
            onClick={onClickSalaryInput}
            className="checkbox-input"
          />
          <label htmlFor={salaryRange.salaryRangeId} className="filter-label">
            {salaryRange.label}
          </label>
        </li>
      )
    })
  }

  const renderSalaryRange = () => (
    <div>
      <hr className="separator" />
      <h1 className="filter-heading">Salary Range</h1>
      <ul className="filter-list">{renderSalaryRangeList()}</ul>
    </div>
  )

  const renderEmploymentTypeList = () => {
    const {employmentTypesList} = props

    return employmentTypesList.map(eachEmploymentType => {
      const {changeEmploymentType} = props
      const onClickEmploymentType = event =>
        changeEmploymentType(event.target.value)
      return (
        <li className="filter-item" key={eachEmploymentType.employmentTypeId}>
          <input
            type="checkbox"
            id={eachEmploymentType.employmentTypeId}
            value={eachEmploymentType.employmentTypeId}
            onClick={onClickEmploymentType}
            className="checkbox-input"
          />
          <label
            htmlFor={eachEmploymentType.employmentTypeId}
            className="filter-label"
          >
            {eachEmploymentType.label}
          </label>
        </li>
      )
    })
  }

  const renderEmploymentTypes = () => (
    <>
      <hr className="separator" />
      <h1 className="filter-heading">Type of Employment</h1>
      <ul className="filter-list">{renderEmploymentTypeList()}</ul>
    </>
  )

  return (
    <div className="filters-group-container">
      {renderEmploymentTypes()}
      {renderSalaryRange()}
    </div>
  )
}

export default FiltersGroup
