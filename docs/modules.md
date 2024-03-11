[@wui/web-user-interface-node](README.md) / Exports

# @wui/web-user-interface-node

## Table of contents

### Functions

- [WuiSupported](modules.md#wuisupported)
- [registerEventListener](modules.md#registereventlistener)
- [registerFailureCallback](modules.md#registerfailurecallback)
- [sendEvent](modules.md#sendevent)
- [unregisterEventListener](modules.md#unregistereventlistener)
- [unregisterFailureCallback](modules.md#unregisterfailurecallback)

## Functions

### WuiSupported

▸ **WuiSupported**(): `boolean`

#### Returns

`boolean`

true if WUI is supported, false otherwise.

**`Brief`**

WUI is only supported in the WUI library and its internal functions. Detected via the global object.

#### Defined in

types.ts:34

___

### registerEventListener

▸ **registerEventListener**\<`payload_t`\>(`eventName`, `callback`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `payload_t` | `Record`\<`string`, `unknown`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventName` | `string` | for which the backend is listening |
| `callback` | (`payload`: `payload_t`) => `void` | to call when the event is received |

#### Returns

`void`

**`Brief`**

Register a listener for a given event name.

#### Defined in

PersistentCallback.ts:90

___

### registerFailureCallback

▸ **registerFailureCallback**(`callback`): `void`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `callback` | (`errorCode`: `number`, `errorMessage`: `string`) => `void` | to call when a persistent query fails |

#### Returns

`void`

**`Brief`**

register a single callback that is called when any persistent query fails. If none is registered a console warning is printed instead.

#### Defined in

PersistentCallback.ts:124

___

### sendEvent

▸ **sendEvent**\<`payload_t`, `successObject_t`\>(`eventName`, `payload`): `Promise`\<`successObject_t`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `payload_t` | extends `Record`\<`string`, `unknown`\> |
| `successObject_t` | `Record`\<`string`, `unknown`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventName` | `string` | for which the backend is listening |
| `payload` | `payload_t` |  |

#### Returns

`Promise`\<`successObject_t`\>

resolve on success, reject on failure

**`Brief`**

Send a single event to a backend destination which is listening for it.

#### Defined in

singleEvents.ts:10

___

### unregisterEventListener

▸ **unregisterEventListener**\<`payload_t`\>(`eventName`, `callback`): `boolean`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `payload_t` | `Record`\<`string`, `unknown`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventName` | `string` | for which the backend is listening |
| `callback` | (`payload`: `payload_t`) => `void` | to call when the event is received |

#### Returns

`boolean`

true if the callback was removed, false otherwise (e.g. if it was not registered)

**`Brief`**

Unregister a listener for a given event name.

#### Defined in

PersistentCallback.ts:109

___

### unregisterFailureCallback

▸ **unregisterFailureCallback**(): `void`

#### Returns

`void`

**`Brief`**

unregister the failure callback

#### Defined in

PersistentCallback.ts:133
