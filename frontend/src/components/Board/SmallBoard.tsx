import './Board.css'

interface SmallBoard {
    smallBoard: number[];
    color: string;
    bb: number;
    makeMove(bb: number, sb: number): void;
}

export default function SmallBoard({ bb, smallBoard, makeMove, color } : SmallBoard) {

    return (
        <div className={'small-board ' + color}>
            {smallBoard.map((elem, sb) => {
                return(
                    <div onClick={() => makeMove(bb, sb)} className='field'>
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