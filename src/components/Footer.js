import {Button} from 'react-bootstrap';

export function Footer(){
    return(
        <div id={"footer"}>
            <p className={"myInfo"}>Aldin Ahmethodžić</p>
            <p className={"myInfo"}>Univerzitet u Sarajevu, Prirodno-matematički fakultet</p>
            <p className={"myInfo"}>Odsjek za matematiku, 2020/2021</p>
            <p className={"myInfo"}>Dinamički web sistemi, projekat</p>
            <p className={"myInfo"}>Prof. dr. Adis Alihodžić</p>
            <Button href={"#ontop"} variant="secondary" id={"top"}>Back to top</Button>
        </div>
    )
}