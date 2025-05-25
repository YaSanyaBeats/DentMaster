import { OrbitControls } from '../static/three.js/OrbitControls.js';
import { FontLoader } from '../static/three.js/FontLoader.js';
import * as THREE from '../static/three.js/three.module.min.js';

class Cloud {
    constructor(root) {
        this.root = $(root);
        this.textObjects = [];
        this.figureName = 'cube';
        this.clock = new THREE.Clock();
        
        this.initScene();
        this.render.call(this);
        this.bindListeners.call(this);
    }

    initScene() {
        this.scene = new THREE.Scene();
        this.scene.background = null;
    
        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        this.camera.position.z = 60;

        this.renderer = new THREE.WebGLRenderer({ alpha: true });
        this.renderer.setSize( $(this.root).width(), $(this.root).height() );
        this.renderer.setClearColor(0x000000, 0);

        this.controls = new OrbitControls( this.camera, this.renderer.domElement );
        this.controls.enableZoom = false;
        this.controls.target.set( 0, 0.5, 0 );
        this.controls.update();
        this.controls.enablePan = false;
        this.controls.enableDamping = true;


        this.root.append( this.renderer.domElement );

        this.group = new THREE.Group();
        this.scene.add( this.group );
        
        this.initSprites();
        this.drawFigure.call(this);
    }

    bindListeners() {
        //window.addEventListener( 'resize', this.onWindowResize.bind(this) );
    }
    
    setFigure(figureName) {
        this.figureName = figureName;
        this.drawFigure();
    }

    initSprites() {
        const map = new THREE.TextureLoader().load( '../images/dark_logo.png' );
        
        map.minFilter = THREE.NearestFilter;
        map.magFilter = THREE.NearestFilter;
        
        this.sprites = [];
        for(let i = 0; i < 400; i++) {
            const spriteMaterial = new THREE.SpriteMaterial( { map: map } );

            const sprite = new THREE.Sprite( spriteMaterial );
            
            
            sprite.scale.set(10, 2, 1);
            sprite.position.set(0, 0, 0);
            this.sprites.push(sprite);
            this.group.add( sprite );
        }
    }

    drawFigure(font) {
        let geometry;

        switch(this.figureName) {
            case 'cube':
                geometry = new THREE.BoxGeometry( 40, 40, 40, 4, 4, 4 );
                break;
            case 'torus':
                geometry = new THREE.TorusGeometry( 20, 8, 7, 12 ); 
                break;
            case 'dodecahedron':
                geometry = new THREE.DodecahedronGeometry( 30, 1 );
                break;
            case 'lathe':
                const points = [];
                for ( let i = 0; i < 10; i ++ ) {
                    points.push( new THREE.Vector2( Math.sin( i * 0.2 ) * 30 + 5, ( i - 5 ) * 4 ) );
                }
                geometry = new THREE.LatheGeometry( points );
                break;
            case 'octahedron':
                geometry = new THREE.OctahedronGeometry( 30, 3 );
                break;
            case 'sphere':
                geometry = new THREE.SphereGeometry( 30, 7, 15 );
                break;
            default:
                geometry = new THREE.BoxGeometry( 40, 40, 40, 4, 4, 4 );
                break;
        }
        

        const material = new THREE.MeshBasicMaterial( {
            //color: color,
            transparent: true,
            opacity: 0.4,
            side: THREE.DoubleSide
        } );
        
        this.figure = new THREE.Mesh( geometry, material );
        //this.scene.add( this.figure );

        
        
        this.render.call(this);
    }

    updateSprites(timeDelta) {

        const positionAttribute = this.figure.geometry.attributes.position;
        const worldVertices = [];

        timeDelta *= 1000;
        
        for (let i = 0; i < positionAttribute.count; i++) {
            const vertex = new THREE.Vector3();
            vertex.fromBufferAttribute(positionAttribute, i);
            vertex.applyMatrix4(this.figure.matrixWorld);
            worldVertices.push(vertex);   
        }

        let counter = 0;
        for (let i = 0; i < 400; i++) {
            if(worldVertices[i]) {
                counter++;

                this.sprites[i].material.opacity = 1;
                let vertex = worldVertices[i];

                if(Math.abs(this.sprites[i].position.x - vertex.x) > timeDelta) {
                    if((this.sprites[i].position.x - vertex.x) > timeDelta) {
                        this.sprites[i].position.x -= timeDelta;
                    }
                    else if((this.sprites[i].position.x - vertex.x) < timeDelta) {
                        this.sprites[i].position.x += timeDelta;
                    }
                    else {
                        this.sprites[i].position.x = vertex.x;
                    }
                }
                else {
                    this.sprites[i].position.x = vertex.x;
                }
                
                if(Math.abs(this.sprites[i].position.y - vertex.y) > timeDelta) {
                    if((this.sprites[i].position.y - vertex.y) > timeDelta) {
                        this.sprites[i].position.y -= timeDelta;
                    }
                    else if((this.sprites[i].position.y - vertex.y) < timeDelta) {
                        this.sprites[i].position.y += timeDelta;
                    }
                    else {
                        this.sprites[i].position.y = vertex.y;
                    }
                }
                else {
                    this.sprites[i].position.y = vertex.y;
                }

                if(Math.abs(this.sprites[i].position.z - vertex.z) > timeDelta) {
                    if((this.sprites[i].position.z - vertex.z) > timeDelta) {
                        this.sprites[i].position.z -= timeDelta;
                    }
                    else if((this.sprites[i].position.x - vertex.z) < timeDelta) {
                        this.sprites[i].position.z += timeDelta;
                    }
                    else {
                        this.sprites[i].position.z = vertex.z;
                    }
                }
                else {
                    this.sprites[i].position.z = vertex.z;
                }


                // this.sprites[i].position.x = vertex.x;
                // this.sprites[i].position.y = vertex.y;
                // this.sprites[i].position.z = vertex.z;
            }
            else {
                this.sprites[i].material.opacity = 0
            }
        }

    }

    onWindowResize() {

        this.camera.aspect = 1;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize( window.innerWidth, window.innerHeight );

        this.render.call(this);

    }

    render() {
        requestAnimationFrame( this.render.bind(this) );
        if(this.figure) {
            let timeDelta = this.clock.getDelta();
            timeDelta *= 0.05;
            this.figure.rotation.x += timeDelta;
            this.figure.rotation.y += timeDelta;
            this.figure.rotation.z += timeDelta;
            this.figure.updateMatrixWorld();
            this.updateSprites(timeDelta);
        }

        this.controls.update();
        this.renderer.render( this.scene, this.camera );
    }
}

const isTablet = document.documentElement.clientWidth < 1100;

function initCloud() {
    if(!isTablet) {
        const cloud = new Cloud('#cloud');
    }
    $('.cloud__tab-elem').on('click', function (event){
        $('.cloud__tab-elem.tabs__elem_active').removeClass('tabs__elem_active');
        $(this).addClass('tabs__elem_active');
        if(!isTablet) {
            cloud.setFigure($(this).data('figure'));
        }
    })
}

initCloud();
