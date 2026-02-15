import type { Patient } from '@medplum/fhirtypes';
import type { IpmPaciente } from '../types/ipm.js';

const RACA_COR_MAP: Record<string, { code: string; display: string }> = {
  branca: { code: '01', display: 'Branca' },
  preta: { code: '02', display: 'Preta' },
  parda: { code: '03', display: 'Parda' },
  amarela: { code: '04', display: 'Amarela' },
  indigena: { code: '05', display: 'Indígena' },
};

/**
 * Constrói recurso BRCorePatient a partir de dados do IPM.
 * Campos obrigatórios BR Core: CPF, gender, raça/cor.
 */
export function buildPatient(ipm: IpmPaciente, uuid: string): Patient {
  const raca = RACA_COR_MAP[ipm.raca_cor] ?? { code: '99', display: 'Sem informação' };

  const identifiers: Patient['identifier'] = [
    {
      use: 'official',
      type: {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
            code: 'TAX',
          },
        ],
      },
      system: 'https://saude.gov.br/fhir/sid/cpf',
      value: ipm.cpf,
    },
  ];

  if (ipm.cns) {
    identifiers.push({
      use: 'official',
      type: {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
            code: 'HC',
          },
        ],
      },
      system: 'https://saude.gov.br/fhir/sid/cns',
      value: ipm.cns,
    });
  }

  return {
    resourceType: 'Patient',
    id: uuid,
    meta: {
      profile: ['https://br-core.saude.gov.br/fhir/StructureDefinition/br-core-patient'],
    },
    identifier: identifiers,
    name: [
      {
        use: 'official',
        text: ipm.nome,
        ...(ipm.nome.includes(' ')
          ? {
              given: [ipm.nome.split(' ')[0]],
              family: ipm.nome.split(' ').slice(1).join(' '),
            }
          : {}),
      },
      ...(ipm.nome_social
        ? [
            {
              use: 'usual' as const,
              text: ipm.nome_social,
            },
          ]
        : []),
    ],
    ...(ipm.telefone
      ? {
          telecom: [
            {
              system: 'phone',
              value: ipm.telefone,
              use: 'mobile',
            },
          ],
        }
      : {}),
    ...(ipm.endereco || ipm.municipio_ibge
      ? {
          address: [
            {
              use: 'home' as const,
              ...(ipm.endereco ? { text: ipm.endereco } : {}),
              ...(ipm.municipio_ibge
                ? {
                    city: ipm.municipio_ibge,
                    extension: [
                      {
                        url: 'http://www.saude.gov.br/fhir/r4/StructureDefinition/BRMunicipio',
                        valueCode: ipm.municipio_ibge,
                      },
                    ],
                  }
                : {}),
            },
          ],
        }
      : {}),
    gender: ipm.sexo === 'F' ? 'female' : 'male',
    birthDate: ipm.data_nascimento,
    extension: [
      {
        url: 'https://br-core.saude.gov.br/fhir/StructureDefinition/BRRacaCorEtnia-1.0',
        valueCodeableConcept: {
          coding: [
            {
              system: 'https://br-core.saude.gov.br/fhir/CodeSystem/BRRacaCor',
              code: raca.code,
              display: raca.display,
            },
          ],
        },
      },
    ],
  };
}
