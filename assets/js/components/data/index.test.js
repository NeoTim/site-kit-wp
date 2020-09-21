/**
 * dataAPI request functions tests.
 *
 * Site Kit by Google, Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Internal dependencies
 */
import dataAPI from './index';
import * as Tracking from '../../util/api';

describe( 'googlesitekit.dataAPI', () => {
	let trackEventSpy;

	beforeEach( () => {
		trackEventSpy = jest.spyOn( Tracking, 'trackAPIError' );
	} );

	afterEach( async () => {
		trackEventSpy.mockRestore();
	} );

	describe( 'get', () => {
		const { get } = dataAPI;
		it( 'should throw call trackEvent when an error is returned on get', async () => {
			const errorResponse = {
				code: 'internal_server_error',
				message: 'Internal server error',
				data: { status: 500 },
			};

			fetchMock.getOnce(
				/^\/google-site-kit\/v1\/core\/search-console\/data\/users/,
				{ body: errorResponse, status: 500 }
			);

			try {
				get( 'core', 'search-console', 'users' );
			} catch ( err ) {
				expect( console ).toHaveErrored();
				expect( trackEventSpy ).toHaveBeenCalledWith(
					'GET',
					'users',
					'core',
					'search-console', { code: 'internal_server_error',
						data: { status: 500 },
						message: 'Internal server error' }
				);
			}
		} );
	} );

	describe( 'set', () => {
		const { set } = dataAPI;
		it( 'should throw call trackEvent when an error is returned on set', async () => {
			const errorResponse = {
				code: 'internal_server_error',
				message: 'Internal server error',
				data: { status: 500 },
			};

			fetchMock.postOnce(
				/^\/google-site-kit\/v1\/core\/search-console\/data\/settings/,
				{ body: errorResponse, status: 500 }
			);

			try {
				set( 'core', 'search-console', 'settings', 'data' );
			} catch ( err ) {
				expect( console ).toHaveErrored();

				expect( trackEventSpy ).toHaveBeenCalledWith(
					'POST',
					'settings',
					'core',
					'search-console', { code: 'internal_server_error',
						data: { status: 500 },
						message: 'Internal server error' }
				);
			}
		} );
	} );
} );