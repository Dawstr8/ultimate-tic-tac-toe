import './Board.css'

interface SmallBoard {
    smallBoard: number[];
    color: string;
}

export default function SmallBoard({ smallBoard, color } : SmallBoard) {

    return (
        <div className={'small-board ' + color}>
            {smallBoard.map((elem) => {
                return(
                    <div className='field'>
                        {elem === 0 ?
                            <div className='field-empty'></div>
                            :
                            <div>
                                {elem === 1 ?
                                    <div className='field-x'>X</div>
                                :
                                    <div className='field-o'>O</div>
                                }
                            </div>
                        }
                    </div>
                )
            })}
        </div>
    );
}