import { S as Schema } from './Schema-CuyurjSt.js';
import * as react from 'react';
import { Operation as Operation$1, Oas as Oas$1 } from '@kubb/oas';
import { KubbNode } from '@kubb/react';
import { a as OperationGenerator } from './OperationGenerator-DvyNt6Xi.js';
import '@kubb/fs/types';
import './SchemaMapper-BpjlzuXc.js';
import '@kubb/core';
import './types-RVAPVtNi.js';

type Props$1 = {
    operation: Operation$1;
    children?: KubbNode;
};
type OperationContextProps = {
    operation?: Operation$1;
};
declare function Operation({ operation, children }: Props$1): KubbNode;
declare namespace Operation {
    var Context: react.Context<OperationContextProps>;
}

type Props = {
    oas: Oas$1;
    operations?: Operation$1[];
    generator?: OperationGenerator;
    children?: KubbNode;
};
type OasContextProps = {
    oas?: Oas$1;
    operations?: Operation$1[];
    generator?: OperationGenerator;
};
declare function Oas({ oas, children, operations, generator }: Props): KubbNode;
declare namespace Oas {
    var Context: react.Context<OasContextProps>;
    var Operation: typeof Operation;
    var Schema: typeof Schema;
}

export { Oas, Operation, Schema };
