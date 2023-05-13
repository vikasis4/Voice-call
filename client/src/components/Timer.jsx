import React from 'react'

const Timer = () => {

    const [seconds, setSeconds] = React.useState(0);
    const [Mins, setMins] = React.useState(0);
    const action = () => {
        setSeconds(0)
        setMins(Mins + 1)
    }
    React.useEffect(() => {
        var time = setTimeout(() => {
            seconds === 59 ? action() : setSeconds(seconds + 1)
        }, 1000)
        return () => clearTimeout(time)
    })

    var txt = {
        textAlign: 'center',
        marginTop: 8,
        color: 'white',
        fontFamily: 'Vollkorn, serif'
    }

    return (
        <div style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <h1 style={txt}> {Mins.toString().length === 1 ? '0' + Mins : Mins}:{seconds.toString().length === 1 ? '0' + seconds : seconds}</h1>
        </div>
    )
}

export default Timer
