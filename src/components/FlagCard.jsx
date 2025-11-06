import './FlagCard.css'
import * as flags from 'country-flag-icons/react/3x2'

function FlagCard(props) {
  const { card, isFlipped, onClick } = props
  const FlagComponent = flags[card.countryCode]

  const cardClass = 'flag-card' + (isFlipped ? ' flipped' : '')

  return (
    <div className={cardClass} onClick={onClick}>
      <div className="card-inner">
        <div className="card-front">
          <div className="card-back-symbol">?</div>
        </div>
        <div className="card-back">
          {card.type === 'flag' ? (
            <div className="flag-container">
              {FlagComponent && <FlagComponent title={card.countryName} />}
            </div>
          ) : (
            <div className="country-name">
              {card.countryName}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FlagCard
