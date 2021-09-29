import * as React from "react";
import ReactDOMServer from 'react-dom/server';
import {
  Box,
  Heading,
  Text,
  VStack,
  Button,
  Input,
  LinkBox,
  LinkOverlay,
  SimpleGrid,
  Divider,
  Link,
  Center,
  Spinner,
  Alert,
  AlertIcon,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Image,
  Avatar as Av
} from "@chakra-ui/react"
import { ExternalLinkIcon } from '@chakra-ui/icons'
import LazyLoad from 'react-lazyload';


import Avatar from 'avataaars';

import IPFS from 'ipfs-http-client-lite';
const ipfs = IPFS({
  apiUrl: 'https://ipfs.infura.io:5001'
})
class MintPage extends React.Component {

  state = {
    top: ["NoHair", "Eyepatch", "Hat", "Hijab", "Turban", "WinterHat1", "WinterHat2", "WinterHat3", "WinterHat4", "LongHairBigHair", "LongHairBob", "LongHairBun", "LongHairCurly", "LongHairCurvy", "LongHairDreads", "LongHairFrida", "LongHairFro", "LongHairFroBand", "LongHairNotTooLong", "LongHairShavedSides", "LongHairMiaWallace", "LongHairStraight", "LongHairStraight2", "LongHairStraightStrand", "ShortHairDreads01", "ShortHairDreads02", "ShortHairFrizzle", "ShortHairShaggyMullet", "ShortHairShortCurly", "ShortHairShortFlat", "ShortHairShortRound", "ShortHairShortWaved", "ShortHairSides", "ShortHairTheCaesar"],
    accessories: ["Blank", "Kurt", "Prescription01", "Prescription02", "Round", "Sunglasses"],
    hairColor: ["Auburn", "Black", "Blonde", "BlondeGolden", "Brown", "BrownDark", "PastelPink", "Platinum", "Red"],
    facialHair: ["Blank", "BeardMedium","Blank", "BeardLight", "BeardMajestic", "MoustacheFancy"],
    facialHairColor: ["Auburn", "Black", "Blonde", "BlondeGolden", "Brown", "BrownDark", "Platinum"],
    clothes: ["BlazerShirt", "BlazerSweater", "CollarSweater", "GraphicShirt", "Hoodie", "Overall", "ShirtCrewNeck", "ShirtScoopNeck"],
    clothesColor: ["Black", "Blue01", "Blue02", "Blue03", "Gray01", "Gray02", "Heather", "PastelBlue", "PastelGreen", "PastelOrange", "PastelRed", "PastelYellow", "Pink", "Red"],
    eye: ["Close", "Cry", "Default", "Dizzy", "EyeRoll", "Happy", "Hearts", "Side", "Squint", "Surprised", "Wink"],
    eyebrown: ["Angry", "AngryNatural", "Default", "DefaultNatural", "FlatNatural", "RaisedExcited", "RaisedExcitedNatural", "SadConcerned", "SadConcernedNatural", "UnibrowNatural", "UpDown"],
    mouth: ["Concerned", "Default", "Disbelief", "Eating", "Sad", "ScreamOpen", "Serious", "Smile", "Twinkle"],
    skin: ["Tanned", "Yellow", "Pale", "Light", "Brown", "DarkBrown"],
    savedBlobs: [],
    allHashAvatars: [],
    supply: 1,
    minting: false,
    mintingMsg: '',
    toClaim: [],
    canMint: true
  }
  constructor(props){
    super(props)
    this.randomize = this.randomize.bind(this);
    this.mint = this.mint.bind(this);
  }
  componentDidMount = async () => {
    try{

      document.getElementById("input_name").focus();
      document.getElementById("input_name").select();
      this.randomize();
      await this.checkEvents();
      let hasNotConnected = !this.props.coinbase;
      const web3 = this.props.web3;
      setInterval(async () => {
        if(this.props.savedBlobs.length !== this.state.allHashAvatars){
          this.checkEvents();
        }
        if(this.props.provider && hasNotConnected){
          const promises = [];
          const claimed = [];
          if(this.props.rewards != null){
            let toClaim = await Promise.all(claimed);
            toClaim = toClaim.filter(item => {
              if(item.hasClaimed === false && this.props.coinbase.toLowerCase() === item.creator?.toLowerCase()){
                return(item);
              }
            });
            console.log(toClaim);
            this.setState({
              toClaim: toClaim
            });
          }

          hasNotConnected = false;

        }
      },500);



    } catch(err){

    }
  }

  randomize = async () => {

    this.setState({
      avatar: {
        avatarStyle: 'Circle',
        topType: this.state.top[Math.floor(Math.random() * this.state.top.length)],
        accessoriesType: this.state.accessories[Math.floor(Math.random() * this.state.accessories.length)],
        hairColor: this.state.hairColor[Math.floor(Math.random() * this.state.hairColor.length)],
        facialHairType: this.state.facialHair[Math.floor(Math.random() * this.state.facialHair.length)],
        facialHairColor:  this.state.facialHairColor[Math.floor(Math.random() * this.state.facialHairColor.length)],
        clotheType: this.state.clothes[Math.floor(Math.random() * this.state.clothes.length)],
        clotheColor : this.state.clothesColor[Math.floor(Math.random() * this.state.clothesColor.length)],
        eyeType: this.state.eye[Math.floor(Math.random() * this.state.eye.length)],
        eyebrowType: this.state.eyebrown[Math.floor(Math.random() * this.state.eyebrown.length)],
        mouthType: this.state.mouth[Math.floor(Math.random() * this.state.mouth.length)],
        skinColor: this.state.skin[Math.floor(Math.random() * this.state.skin.length)],
      }
    });



  }


  mint = async () => {
    try{
      this.setState({
        minting: true
      });
      if(this.state.avatar.name.replace(/ /g, '') === "" || !this.state.avatar.name){
        this.setState({
          minting: false
        });
        return;
      }
      this.setState({
        mintingMsg: <p><small>Checking all tokens already minted ... </small></p>
      });
      const results = await this.props.checkTokens();
      let metadatas = this.props.savedBlobs.map(string => {
        const obj = JSON.parse(string)
        return(obj.metadata)
      })

      if(this.props.loadingAvatars){
        const metaPromises = []
        for(let res of results){
          if(this.props.netId === 4 && res.returnValues._id === 32){
            continue
          }
          const metadataToken = this.props.getMetadata(res.returnValues._id);
          metaPromises.push(metadataToken)
        }
        metadatas = await Promise.all(metaPromises);
      }

      let cont = true;

      metadatas.map(obj => {
        //const obj = JSON.parse(string);
        if(obj.name === this.state.avatar.name) {
          cont = false
        }
      });
      if(!cont){
        alert("HashAvatar with that name already claimed");
        this.setState({
          minting: false
        });
        return;
      }

      this.setState({
        mintingMsg: <p><small>Storing image and metadata at IPFS ... </small></p>
      });
      //const ipfs = this.props.ipfs;
      const imgres = await ipfs.add(this.state.svg);
      let metadata = {
          name: this.state.avatar.name,
          image: `ipfs://${imgres[0].hash}`,
          external_url: `https://thehashavatars.com`,
          description: "Generate and mint your own avatar as ERC1155 NFT",
          attributes: [
            {
              trait_type: "Top Type",
              value: this.state.avatar.topType
            },
            {
              trait_type: "Acessories Type",
              value: this.state.avatar.accessoriesType
            },
            {
              trait_type: "Hair Color",
              value: this.state.avatar.hairColor
            },
            {
                trait_type: "Facial Hair Type",
                value: this.state.avatar.facialHairType
            },
            {
                trait_type: "Facial Hair Color",
                value: this.state.avatar.facialHairColor
            },
            {
                trait_type: "Clothe Type",
                value: this.state.avatar.clotheType
            },
            {
                trait_type: "Clothe Color",
                value: this.state.avatar.clotheColor
            },
            {
                trait_type: "Eye Type",
                value: this.state.avatar.eyeType
            },
            {
                trait_type: "Eyebrow Type",
                value: this.state.avatar.eyebrowType
            },
            {
                trait_type: "Mouth Type",
                value: this.state.avatar.mouthType
            },
            {
                trait_type: "Skin Color",
                value: this.state.avatar.skinColor
            },
            {
                trait_type: "DNA",
                value: this.state.avatar.dna
            },
          ]
      }
      const res = await ipfs.add(JSON.stringify(metadata));
      const uri = res[0].hash;
      //const uri = res.path;
      this.setState({
        mintingMsg: <p><small>Approve transaction ... </small></p>
      });
      const id = Number(await this.props.itoken.methods.totalSupply().call()) + 1;
      console.log(id)
      const fees = [{
        recipient: this.props.coinbase,
        value: 500
      }];
      let supply = this.state.supply;
      if(typeof(supply !== Number)){
        supply = 1
      }
      await this.props.itoken.methods.mint(id,fees,supply,uri).send({
        from: this.props.coinbase,
        value: 10 ** 18,
        gasPrice: 1000000000
      }).once('transactionHash',(hash) => {
        this.setState({
          mintingMsg: <p><small>Transaction <Link href={`https://blockscout.com/xdai/mainnet/tx/${hash}`} isExternal >{hash}</Link> sent, wait confirmation ...</small></p>
        });
      });
      this.setState({
        mintingMsg: <p><small>Transaction confirmed!</small></p>
      });
      setTimeout(() => {
        this.setState({
          minting: false
        });
      },5000)

    } catch(err){
      this.setState({
        mintingMsg: <p><small>{err.message}</small></p>
      });
      setTimeout(() => {
        this.setState({
          minting: false
        });
      },2000)
    }
  }

  checkEvents = async () => {
    this.state.allHashAvatars = this.props.savedBlobs;
    this.state.allHashAvatars.map(async str => {
      const obj = JSON.parse(str);
      if(this.props.coinbase){
        if(obj.creator.toLowerCase() === this.props.coinbase.toLowerCase() && !this.state.savedBlobs.includes(JSON.stringify(obj))){
          this.state.savedBlobs.push(JSON.stringify(obj));
        }

      }
      /*
      if(this.props.rewards !== undefined && this.props.coinbase){
        const claim = await this.props.checkClaimed(obj.returnValues._id);
        if(claim.hasClaimed === false && this.props.coinbase.toLowerCase() === claim.creator?.toLowerCase()){
          this.state.toClaim.push(claim);
        }
      }
      */
    })
    this.forceUpdate()
  }

  handleOnChange = (e) => {
      e.preventDefault();
      if(e.target.name === "supply"){
        this.setState({
          supply: e.target.value
        });
        return;
      }
      try{
        const web3 = this.props.web3;
        const dna = web3.utils.toBN(web3.utils.toHex(web3.utils.sha3(e.target.value.trim()))).toString();
        let topIndex = (Number(dna.substring(0,2)) % 35 + 1).toFixed(0);
        if(topIndex > this.state.top.length - 1){
          topIndex = topIndex - (this.state.top.length - 1)*(topIndex/(this.state.top.length - 1));
        }
        let accessoriesIndex = (Number(dna.substring(2,3)) % 6 + 1).toFixed(0);
        if(accessoriesIndex > this.state.accessories.length - 1){
          accessoriesIndex = accessoriesIndex - (this.state.accessories.length - 1)*(accessoriesIndex/(this.state.accessories.length - 1));
        }
        let hairColorIndex = (Number(dna.substring(4,5)) % 9 + 1).toFixed(0);
        if(hairColorIndex > this.state.hairColor.length - 1){
          hairColorIndex = hairColorIndex - (this.state.hairColor.length - 1)*(hairColorIndex/(this.state.hairColor.length - 1));
        }
        let facialHairIndex = (Number(dna.substring(6,7)) % 6 + 1).toFixed(0);
        if(facialHairIndex > this.state.facialHair.length - 1){
          facialHairIndex = facialHairIndex - (this.state.facialHair.length - 1)*(facialHairIndex/(this.state.facialHair.length - 1));
        }
        let facialHairColorIndex = (Number(dna.substring(8,9)) % 7 + 1).toFixed(0);
        if(facialHairColorIndex > this.state.facialHairColor.length - 1){
          facialHairColorIndex = facialHairColorIndex - (this.state.facialHairColor.length - 1)*(facialHairColorIndex/(this.state.facialHairColor.length - 1));
        }
        let clotheIndex = (Number(dna.substring(10,11)) % 8 + 1).toFixed(0);
        if(clotheIndex > this.state.clothes.length - 1){
          clotheIndex = clotheIndex - (this.state.clothes.length - 1)*(clotheIndex/(this.state.clothes.length - 1));
        }
        let clotheColorIndex = (Number(dna.substring(12,14)) % 14 + 1).toFixed(0);
        if(clotheColorIndex > this.state.clothesColor.length - 1){
          clotheColorIndex = clotheColorIndex - (this.state.clothesColor.length - 1)*(clotheColorIndex/(this.state.clothesColor.length - 1));
        }
        let eyeTypeIndex = (Number(dna.substring(14,16)) % 14 + 1).toFixed(0);
        if(eyeTypeIndex > this.state.eye.length - 1){
          eyeTypeIndex = eyeTypeIndex - (this.state.eye.length - 1)*(eyeTypeIndex/(this.state.eye.length - 1));
        }
        let eyebrowIndex = (Number(dna.substring(16,18)) % 11 + 1).toFixed(0);
        if(eyebrowIndex > this.state.eyebrown.length - 1){
          eyebrowIndex = eyebrowIndex - (this.state.eyebrown.length - 1)*(eyebrowIndex/(this.state.eyebrown.length - 1));
        }
        let mouthTypeIndex = (Number(dna.substring(18,20)) % 11 + 1).toFixed(0);
        if(mouthTypeIndex > this.state.mouth.length - 1){
          mouthTypeIndex = mouthTypeIndex - (this.state.mouth.length - 1)*(mouthTypeIndex/(this.state.mouth.length - 1));
        }
        let skinTypeIndex = (Number(dna.substring(20,21)) % 6 + 1).toFixed(0);
        if(skinTypeIndex > this.state.skin.length - 1){
          skinTypeIndex = skinTypeIndex - (this.state.skin.length - 1)*(skinTypeIndex/(this.state.skin.length - 1));
        }
        const avatar = {
          avatarStyle: 'Circle',
          topType: this.state.top[topIndex],
          accessoriesType: this.state.accessories[accessoriesIndex],
          hairColor: this.state.hairColor[hairColorIndex],
          facialHairType: this.state.facialHair[facialHairIndex],
          facialHairColor:  this.state.facialHairColor[facialHairColorIndex],
          clotheType: this.state.clothes[clotheIndex],
          clotheColor : this.state.clothesColor[clotheColorIndex],
          eyeType: this.state.eye[eyeTypeIndex],
          eyebrowType: this.state.eyebrown[eyebrowIndex],
          mouthType: this.state.mouth[mouthTypeIndex],
          skinColor: this.state.skin[skinTypeIndex],
          name: e.target.value.trim(),
          dna: dna
        }

      const metadatas = this.props.savedBlobs.map(str => {
        const obj = JSON.parse(str);
        return(obj.metadata);
      });
      let cont = true;

      metadatas.map(obj => {
        //const obj = JSON.parse(string);
        if(obj.name === avatar.name) {
          cont = false
          const svg = <Image src={obj.image.replace("ipfs://","https://ipfs.io/ipfs/")}  />
          this.setState({
            avatar: null,
            svg: svg
          });
        }
      });
      if(!cont){
        this.setState({
          canMint: false
        });
        return;
      }
      this.setState({
        canMint: true
      });
      const svg = ReactDOMServer.renderToString(<Avatar {...avatar} />);
      if(this.state.avatar !== avatar) {
        this.setState({
          avatar: avatar,
          svg: svg
        });
      }

    } catch(err){
      console.log(err)
    }
  }

  render(){
    return(
        <Box>
          <VStack spacing={4}>
            <Box>
              <Heading>HashAvatars</Heading>
            </Box>

            {
              (
                this.state.toClaim?.length > 0 &&
                (
                  !this.state.doingClaim ?
                  (
                    <Center>
                    <Alert status="info">
                      <AlertIcon />You have rewards to claim!{' '}
                      <Button onClick={async () => {
                        const ids = this.state.toClaim.map(item => {
                          return(item.id);
                        });
                        this.setState({
                          doingClaim: true
                        })
                        const hash = await this.props.claim(ids);
                        const results = await this.props.checkTokens();
                        const claimed = [];
                        for(let res of results){
                          claimed.push(this.props.checkClaimed(res.returnValues._id));
                        }
                        let toClaim = await Promise.all(claimed);
                        toClaim = toClaim.filter(item => {
                          if(item.hasClaimed === false && this.props.coinbase.toLowerCase() === item.creator.toLowerCase()){
                            return(item);
                          }
                        });
                        this.setState({
                          doingClaim: false,
                          toClaim: toClaim
                        })
                      }}>Claim</Button>
                    </Alert>
                    </Center>

                  ) :
                  (
                    <Spinner size="xl" />
                  )

                )
              )
            }
            <Box align="center">
              <Text fontSize="sm">
                <p>The <b>HashAvatars</b> are Avatars waiting to be claimed by anyone on xDai Chain.</p>
                <p>Once you select the avatar's name a specific avatar figure will be generated and you can mint it.</p>
                <p>Choose your preferred HashAvatar and start your collection now!</p>
              </Text>
            </Box>
            <Box align="center">
              {
                this.state.avatar ?
                (
                  <Avatar {...this.state.avatar} />
                ) :
                (
                  this.state.svg
                )
              }
              <Text>
                <p>Select the name of your HashAvatar and claim it!</p>
                <Input placeholder="Avatar's Name" size="md" id="input_name" onChange={this.handleOnChange} onKeyUp={this.handleOnChange} style={{marginBottom: '10px'}}/>
                {/*<Input placeholder="Total number of copies (if empty, default = 1)" size="md" onChange={this.handleOnChange} onKeyUp={this.handleOnChange} name="supply" style={{marginBottom: '10px'}}/>*/}
                {
                  (
                    this.props.coinbase ?
                    (
                      !this.state.minting && !this.state.pendingTx ?
                      (
                        this.state.canMint ? (<Button onClick={this.mint}>Claim</Button>) : ("HashAvatar with that name already claimed")
                      ) :
                      (
                        <Box style={{wordBreak: 'break-word'}}>
                        <Spinner size="xl" />
                        {this.state.mintingMsg}
                        </Box>
                      )
                    ) :
                    (
                      !this.props.loading ?
                      (
                        <Button onClick={this.props.connectWeb3}>Connect Wallet</Button>
                      ) :
                      (
                        <Spinner size="xl" />
                      )
                    )
                  )
                }

              </Text>
            </Box>
            <Box>
            {
              this.props.loadingAvatars &&
              (
                <Center>
                 <VStack spacing={4}>
                  <p>Loading all HashAvatars</p>
                  <Spinner size="md" />
                  </VStack>
                </Center>
              )
            }
            </Box>
            <Box>
            {
              (
                !this.props.loadingAvatars &&
                this.state.savedBlobs?.length > 0 &&
                (
                  <Heading>HashAvatars Created by you</Heading>
                )
              )
            }
            </Box>
            <Box>
            <SimpleGrid
              columns={{ sm: 1, md: 6 }}
              spacing="40px"
              mb="20"
              justifyContent="center"
            >
            {
              !this.props.loadingAvatars &&
              this.state.savedBlobs?.map((string) => {
                const blob = JSON.parse(string);
                return(
                  <LazyLoad>
                  <Box
                    rounded="2xl"
                    p="5"
                    borderWidth="1px"
                    _hover={{ boxShadow: '2xl', background: this.state.cardHoverBg }}
                  >
                    <Popover>
                      <PopoverTrigger>
                      <LinkBox
                        // h="200"
                        role="group"
                        as={Link}
                      >
                        <Text
                          fontSize="sm"
                          display="flex"
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <LinkOverlay
                            style={{fontWeight: 600 }}
                            href={blob.url}
                          >
                            {blob.metadata.name}
                          </LinkOverlay>
                        </Text>
                        <Divider mt="4" />
                        <Center>
                          <Av src={blob.metadata.image.replace("ipfs://","https://ipfs.io/ipfs/")} size="2xl"/>
                        </Center>

                      </LinkBox>
                      </PopoverTrigger>
                      <PopoverContent>
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <PopoverHeader>{blob.metadata.name}</PopoverHeader>
                        <PopoverBody>
                        <p><small>Token ID: {blob.returnValues._id}</small></p>
                        <p><small><Link href={`https://epor.io/tokens/${this.props.itoken.options.address}/${blob.returnValues._id}`} isExternal >View on Epor.io{' '}<ExternalLinkIcon fontSize="18px" /></Link></small></p>
                        <p><small><Link href={`https://unifty.io/xdai/collectible.html?collection=${this.props.itoken.options.address}&id=${blob.returnValues._id}`} isExternal >View on Unifty.io{' '}<ExternalLinkIcon fontSize="18px" /></Link></small></p>
                        </PopoverBody>
                      </PopoverContent>
                    </Popover>
                  </Box>
                  </LazyLoad>
                )
              })
            }
            </SimpleGrid>
            </Box>
          </VStack>
        </Box>


    )
  }
}

export default MintPage
