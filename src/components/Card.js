import { ethers } from 'ethers'

const Card = ({ occasion, toggle, setToggle, setOccasion }) => {
  const togglePop = () => {
    setOccasion(occasion)
    setToggle(!toggle)
  }
  return (
    <div className='card'>
      <div className='card__info'>
        <p className='card__date'>
          <strong>{occasion.date}</strong><br />{occasion.time}
        </p>

        <h3 className='card__name'>{occasion.name}</h3>
        <p className='card__location'>{occasion.location}</p>

        <p className='card__cost'>
          <strong>{ethers.utils.formatEther(occasion.cost)}</strong> ETH
        </p>

        {occasion.tickets.toString() === "0" ? (
          <button
            className='card__button--out' type='button'
            disabled
          >
            Sold Out
          </button>
        ) : (
          <button
            className='card__button' type='button'
            onClick={() => togglePop()}
          >
            View Seats
          </button>
        )}
      </div>
      <hr />
    </div>
  );
}

export default Card;