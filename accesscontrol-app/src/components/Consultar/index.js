import React, { useState, useEffect } from 'react';
import { Table } from 'reactstrap';
import { Pagination } from '@material-ui/lab';
import usePagination from '../../hooks/Pagination';
import api from '../../services/api';

import './styles.css';

const Consultar = (props) => {
    const [notas, setNotas] = useState([]);
    const [filteredNotas, setFilteredNotas] = useState([]);
    let [page, setPage] = useState(1);
    const PER_PAGE = 5;
    const count = Math.ceil(notas.length / PER_PAGE);
    const _DATA = usePagination(notas, PER_PAGE);

    let { search } = props;

    const tokenString = localStorage.getItem('token');
    const userToken = JSON.parse(tokenString);

    const handleChange = (e, p) => {
        setPage(p);
        _DATA.jump(p);
    }

    useEffect(() => {
        (async () => {
            const response = await api.get("/notafiscal", {
                headers: {
                    "Authorization": `Bearer ${userToken}`
                }
            });

            setNotas(response.data);
        })();
    }, [userToken]);

    useEffect(() => {
        const filterNotas = notas.filter((nota) => {
            return nota.nf.toString() === search;
        })

        setFilteredNotas(filterNotas);

        // eslint-disable-next-line
    }, [search]);

    const renderHeader = () => {
        let headerElement = ['Transportadora', 'Nota Fiscal', 'Fornecedor', 'Motorista', 'Documento', 'Placa', 'Chegada' ,'Entrada', 'Saída'];

        return headerElement.map((key, index) => {
            return <th key={index}>{key}</th>
        })
    }

    const renderBody = () => {
        if (search === "") {
            return notas && _DATA.currentData()
                    .map(nota => {
                return (
                    <tr key={nota.id}>
                        <td>{nota.transportadora}</td>
                        <td>{nota.nf}</td>
                        <td>{nota.fornecedor}</td>
                        <td>{nota.agendamentos[0] && nota.agendamentos[0].motorista}</td>
                        <td>{nota.agendamentos[0] && nota.agendamentos[0].documento}</td>
                        <td>{nota.agendamentos[0] && nota.agendamentos[0].placa}</td>
                        <td>{nota.agendamentos[0] && nota.agendamentos[0].dataLiberacaoChegada}</td>
                        <td>{nota.agendamentos[0] && nota.agendamentos[0].dataLiberacaoEntrada}</td>
                        <td>{nota.agendamentos[0] && nota.agendamentos[0].dataLiberacaoSaida}</td>
                    </tr>
                )                     
            })        
        }
        
        if (filteredNotas) {
            return filteredNotas.map(nota => {
                return (
                    <tr key={nota.id}>
                        <td>{nota.transportadora}</td>
                        <td>{nota.nf}</td>
                        <td>{nota.fornecedor}</td>
                        <td>{nota.agendamentos[0] && nota.agendamentos[0].motorista}</td>
                        <td>{nota.agendamentos[0] && nota.agendamentos[0].documento}</td>
                        <td>{nota.agendamentos[0] && nota.agendamentos[0].placa}</td>
                        <td>{nota.agendamentos[0] && nota.agendamentos[0].dataLiberacaoChegada}</td>
                        <td>{nota.agendamentos[0] && nota.agendamentos[0].dataLiberacaoEntrada}</td>
                        <td>{nota.agendamentos[0] && nota.agendamentos[0].dataLiberacaoSaida}</td>
                    </tr>
                )                     
            })
        }
    }

    return (
        <>
            <Table borderless responsive hover>
                <thead>
                    <tr>
                        {renderHeader()}
                    </tr>
                </thead>
                <tbody>
                    {renderBody()}
                </tbody>
            </Table>
            <Pagination
                count={count}
                size="large"
                page={page}
                variant="outlined"
                shape="rounded"
                onChange={handleChange}
            />
        </>
    )
}

export default Consultar;