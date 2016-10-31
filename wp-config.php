<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'wordpress');

/** MySQL database username */
define('DB_USER', 'root');

define('FS_METHOD', 'direct');

/** MySQL database password */
define('DB_PASSWORD', '123456');

/** MySQL hostname */
define('DB_HOST', 'localhost');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8mb4');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         'KZ,|b)G{qU~;[B1y Z,,TxY5CFVgz4lm,``9qx`fdJhyS/7i;@P[!*or(tKmYg,w');
define('SECURE_AUTH_KEY',  'v^i:qjI8H@2mn$bgz|Aq!+?(`qajP(!Du@L3vbzNvbC]G>o0)YZ^Jm?jSba5Jhwf');
define('LOGGED_IN_KEY',    'ErPD$D;W-`2?j O`q4<*tvS?qer(KIJ${ ]T5r5MB@$I&KZtdi]*O>ttlMv_W0e|');
define('NONCE_KEY',        'k9 +&Hz 0O%Vdc<`TrW/c{nrZaXF!t)1if7/T295T rlJOmn@kaG:vCGIs]S,=q:');
define('AUTH_SALT',        '8vdY3;m?jU8d%n)xOn:;fLImAlL/_RoG$hslx@|~f<[c_AuJdDJW8L_` oKhx{R ');
define('SECURE_AUTH_SALT', 'i1m=Da#@8Hj71aTu<H9%/G[Zj1)E#xVQ!:pV6nb@p&s4oQ_ms:eg!rxBto(MLQgt');
define('LOGGED_IN_SALT',   'Zh$M!A*5B8Z<c=#ml}Z<;*$%9?~Y+}3ve`-wSU0Vt3(w!vPeOVq:z [N*3FjWr?}');
define('NONCE_SALT',       ')oL9q:^+~yWvH+X7:dvYu%f/!zI<XR ]}9 2[s,Qw<ylL,v{}RFNlXbK1PZt=1E5');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'viblo_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the Codex.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */
define('WP_DEBUG', false);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
